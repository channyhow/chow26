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

vec2 hash22(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(dot(hash22(i), f), dot(hash22(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
    mix(dot(hash22(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)), dot(hash22(i + vec2(1.0)), f - vec2(1.0)), u.x), u.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.54;
  mat2 rotation = mat2(0.80, 0.60, -0.60, 0.80);
  for (int i = 0; i < 7; i++) {
    value += amplitude * noise(p);
    p = rotation * p * 2.02 + vec2(13.7, 9.2);
    amplitude *= 0.51;
  }
  return value;
}

void main() {
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = (v_uv - 0.5) * vec2(aspect, 1.0);

  /* AE-like turbulent base: broad deformation plus nested detail. */
  vec2 warp = vec2(
    fbm(p * 1.18 + vec2(2.4, 7.1)),
    fbm(p * 1.18 + vec2(8.6, 3.3))
  );
  vec2 warped = p + warp * 0.34;

  float broad = fbm(warped * 3.15);
  float medium = fbm(warped * 7.4 + warp * 0.72);
  float fine = fbm(warped * 17.8 - warp * 0.31);
  float grit = noise(warped * 63.0 + vec2(medium, broad) * 2.1);

  /* Convert the turbulent field into a porous network rather than displaying
     FBM as continuous grey smoke. This is the equivalent of pushing AE
     Fractal Noise with Contrast/Brightness until only the branching structure
     remains. */
  float source = broad * 0.68 + medium * 0.25 + fine * 0.07;
  float ridge = 1.0 - abs(source * 2.38);

  /* Medium/open AE state: mostly secondary with connected dark filaments. */
  float edgeNoise = fine * 0.10 + grit * 0.035;
  float network = smoothstep(0.655 + edgeNoise, 0.785 + edgeNoise, ridge);

  /* Fine erosion makes the boundaries dirty and granular instead of smooth. */
  float erosionField = fbm(warped * 26.0 + warp * 0.45);
  float erosion = smoothstep(-0.08, 0.18, erosionField + grit * 0.16);
  network *= mix(0.68, 1.0, erosion);

  /* A second, thinner frequency adds the tiny broken branches visible in AE. */
  float hairSource = fbm(warped * 11.2 + vec2(warp.y, warp.x) * 0.65);
  float hairRidge = 1.0 - abs(hairSource * 2.95);
  float hairs = smoothstep(0.79, 0.91, hairRidge + fine * 0.055);
  network = max(network, hairs * 0.42);

  /* Preserve quiet background. No continuous grey base layer. */
  network = clamp(network, 0.0, 0.88);
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
