import { createPrivateKey, sign } from "node:crypto";

import mediaData from "../../src/data/media.json";

const TOKEN_TTL_SECONDS = 15 * 60;

function base64Url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function createJwt({ playbackId, audience, keyId, privateKeyBase64 }) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(
    JSON.stringify({ alg: "RS256", typ: "JWT" }),
  );
  const payload = base64Url(
    JSON.stringify({
      sub: playbackId,
      aud: audience,
      exp: now + TOKEN_TTL_SECONDS,
      kid: keyId,
    }),
  );
  const unsigned = `${header}.${payload}`;
  const privateKeyPem = Buffer.from(privateKeyBase64, "base64").toString("utf8");
  const privateKey = createPrivateKey(privateKeyPem);
  const signature = sign("RSA-SHA256", Buffer.from(unsigned), privateKey);

  return `${unsigned}.${base64Url(signature)}`;
}

export default async (request) => {
  if (request.method !== "GET") {
    return new Response("Method not allowed", {
      status: 405,
      headers: { Allow: "GET" },
    });
  }

  const url = new URL(request.url);
  const mediaKey = url.searchParams.get("media");
  const media = mediaKey ? mediaData[mediaKey] : undefined;

  if (!media || media.type !== "mux" || !media.playbackId) {
    return Response.json({ error: "Unknown media" }, { status: 404 });
  }

  const keyId = Netlify.env.get("MUX_SIGNING_KEY_ID");
  const privateKeyBase64 = Netlify.env.get("MUX_SIGNING_PRIVATE_KEY");

  if (!keyId || !privateKeyBase64) {
    console.error("Mux signing environment is incomplete");
    return Response.json({ error: "Video unavailable" }, { status: 503 });
  }

  try {
    const playbackToken = createJwt({
      playbackId: media.playbackId,
      audience: "v",
      keyId,
      privateKeyBase64,
    });
    const thumbnailToken = createJwt({
      playbackId: media.playbackId,
      audience: "t",
      keyId,
      privateKeyBase64,
    });

    return Response.json(
      {
        playbackId: media.playbackId,
        playbackPolicy: "signed",
        playbackToken,
        thumbnailToken,
      },
      {
        headers: {
          "Cache-Control": "private, max-age=300",
          "Content-Type": "application/json; charset=utf-8",
          "X-Content-Type-Options": "nosniff",
        },
      },
    );
  } catch (error) {
    console.error("Unable to sign Mux playback", error);
    return Response.json({ error: "Video unavailable" }, { status: 500 });
  }
};
