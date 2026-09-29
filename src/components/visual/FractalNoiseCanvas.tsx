import { useEffect, useRef } from "react";

import "@/styles/components/_fractalNoiseCanvas.scss";

const vertexShaderSource = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const fragmentShaderSource = `
precision highp float;
varying vec2 v_uv;
uniform vec2 u_resolution;
uniform vec3 u_primary;
uniform vec3 u_secondary;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float valueNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(0.94, 0.34, -0.34, 0.94);
  for (int i = 0; i < 5; i++) {
    v += a * valueNoise(p);
    p = m * p * 2.04 + 7.17;
    a *= 0.5;
  }
  return v;
}

void main() {
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = (v_uv - 0.5) * vec2(aspect, 1.0);

  /* Start from an orthogonal lattice. The AE reference has repeated broken
     horizontal/vertical runs and rectangular cells beneath the corrosion. */
  float cells = 11.5;
  vec2 latticeP = p * cells;

  /* Distort the grid, but preserve its orthogonal ancestry. */
  vec2 distortion = vec2(
    fbm(p * 2.15 + vec2(1.8, 6.4)),
    fbm(p * 2.15 + vec2(8.2, 2.1))
  ) - 0.5;
  latticeP += distortion * 1.35;

  vec2 local = abs(fract(latticeP) - 0.5);
  float lineDistance = min(0.5 - local.x, 0.5 - local.y);

  /* Uneven line thickness: some runs disappear, others become rusty clumps. */
  float corrosion = fbm(p * 7.8 + distortion * 1.7);
  float breakup = fbm(p * 18.5 + vec2(corrosion, -corrosion) * 0.8);
  float grain = valueNoise(p * 92.0 + distortion * 3.0);

  float width = 0.055 + corrosion * 0.085 + breakup * 0.025;
  float lattice = 1.0 - smoothstep(width, width + 0.035, lineDistance);

  /* Aggressively rust away sections of the grid. */
  float keep = smoothstep(0.34, 0.63, corrosion * 0.72 + breakup * 0.28);
  lattice *= mix(0.12, 1.0, keep);

  /* Build irregular deposits around surviving lines so it feels printed,
     oxidised and fibrous rather than mathematically generated. */
  float depositField = fbm(p * 13.0 + distortion * 2.4);
  float deposits = smoothstep(0.58, 0.76, depositField + lattice * 0.30);
  deposits *= smoothstep(0.25, 0.70, corrosion);

  /* Fine broken graphite/rust fibres along the lattice. */
  float hairMask = 1.0 - smoothstep(width + 0.025, width + 0.105, lineDistance);
  float hairs = hairMask * smoothstep(0.57, 0.77, breakup + (grain - 0.5) * 0.18);

  float network = max(lattice * 0.72, deposits * 0.56);
  network = max(network, hairs * 0.48);

  /* Grain only dirties existing marks; the off-white ground stays clean. */
  network *= 0.82 + grain * 0.18;
  network = smoothstep(0.10, 0.76, network);
  network = clamp(network * 0.88, 0.0, 0.88);

  vec3 color = mix(u_secondary, u_primary, network);
  gl_FragColor = vec4(color, 1.0);
}
`;

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.trim().replace("#", "");
  const normalized = value.length === 3 ? value.split("").map((char) => char + char).join("") : value;
  const parsed = Number.parseInt(normalized, 16);
  return [((parsed >> 16) & 255) / 255, ((parsed >> 8) & 255) / 255, (parsed & 255) / 255];
}

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Fractal shader compilation failed", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function FractalNoiseCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: false, antialias: false, powerPreference: "low-power" });
    if (!gl) return;

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) return;
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    gl.useProgram(program);
    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const resolution = gl.getUniformLocation(program, "u_resolution");
    const primary = gl.getUniformLocation(program, "u_primary");
    const secondary = gl.getUniformLocation(program, "u_secondary");
    const styles = getComputedStyle(document.documentElement);
    const primaryRgb = hexToRgb(styles.getPropertyValue("--color-primary") || "#161616");
    const secondaryRgb = hexToRgb(styles.getPropertyValue("--color-secondary") || "#f6f5f3");

    const render = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
      gl.viewport(0, 0, width, height);
      gl.uniform2f(resolution, width, height);
      gl.uniform3f(primary, ...primaryRgb);
      gl.uniform3f(secondary, ...secondaryRgb);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    render();
    const observer = new ResizeObserver(render);
    observer.observe(canvas);
    return () => {
      observer.disconnect();
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return <canvas ref={canvasRef} className="fractalNoiseCanvas" aria-hidden="true" />;
}
