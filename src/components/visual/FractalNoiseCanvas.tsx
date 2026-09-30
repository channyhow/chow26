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
uniform vec3 u_accent;
uniform float u_time;
uniform float u_hover;
float hash21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float softNoise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);vec2 u=f*f*(3.0-2.0*f);float a=hash21(i);float b=hash21(i+vec2(1.,0.));float c=hash21(i+vec2(0.,1.));float d=hash21(i+vec2(1.,1.));return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}
mat2 rotate2d(float a){float s=sin(a);float c=cos(a);return mat2(c,-s,s,c);}
float turbulentFractal(vec2 p){float sum=0.;float weight=0.;float amplitude=1.;mat2 r=rotate2d(.055);for(int i=0;i<19;i++){float n=abs(softNoise(p)*2.-1.);sum+=n*amplitude;weight+=amplitude;p=r*p*1.72+vec2(3.17,-1.83);amplitude*=.63;}return sum/max(weight,.0001);}
void main(){
 float aspect=u_resolution.x/max(u_resolution.y,1.);vec2 p=(v_uv-.5)*vec2(aspect,1.);p*=8.0;
 float evolution=u_time*.13;
 vec2 phase=vec2(sin(evolution*.91),cos(evolution*.77));
 vec2 phaseB=vec2(cos(evolution*.63),sin(evolution*1.03));
 vec2 warp=vec2(turbulentFractal(p*.34+vec2(7.1,2.3)+phase*.42),turbulentFractal(p*.34+vec2(-3.8,8.6)+phaseB*.42))-.5;
 vec2 topologyWarp=vec2(turbulentFractal(p*.17+vec2(13.7,-4.2)+phaseB*.30),turbulentFractal(p*.17+vec2(-8.4,11.9)-phase*.30))-.5;
 float n=turbulentFractal(p+warp*.66+topologyWarp*.34);
 float ridgeCenter=.355+sin(evolution*.58)*.008;
 float ridge=abs(n-ridgeCenter);
 float network=1.-smoothstep(.05,.05,ridge);
 float detail=turbulentFractal(p*2.05+warp*.3+phase*.1);
 float micro=turbulentFractal(p*5.8+topologyWarp*.55-phaseB*.13);
 float wash=turbulentFractal(p*.72+warp*.62-topologyWarp*.28+phaseB*.08);
 float grit=softNoise(p*8.+phase*.8);
 float speck=softNoise(p*8.-phaseB*.16);
 network*=smoothstep(.12,.72,detail)*.25+.75;
 network*=.76+micro*.24;
 network+=smoothstep(.56,.88,micro)*.09;
 network*=.9+grit*.8;
 network+=(speck-.5)*.035;
 network=mix(network,network*(.72+wash*.42),.48);
 network=smoothstep(.035,.94,network);
 network=pow(clamp(network,0.,1.),1.08);
 network*=.82;
 vec3 noiseColor=mix(u_primary,u_accent,u_hover);
 gl_FragColor=vec4(mix(u_secondary,noiseColor,network),1.);
}`;

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.trim().replace("#", "");
  const normalized =
    value.length === 3
      ? value
          .split("")
          .map((c) => c + c)
          .join("")
      : value;
  const parsed = Number.parseInt(normalized, 16);
  return [
    ((parsed >> 16) & 255) / 255,
    ((parsed >> 8) & 255) / 255,
    (parsed & 255) / 255,
  ];
}
function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(
      "Fractal shader compilation failed",
      gl.getShaderInfoLog(shader),
    );
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
    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      powerPreference: "low-power",
    });
    if (!gl) return;
    const vs = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource),
      fs = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vs || !fs) return;
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    gl.useProgram(program);
    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const resolution = gl.getUniformLocation(program, "u_resolution"),
      primary = gl.getUniformLocation(program, "u_primary"),
      secondary = gl.getUniformLocation(program, "u_secondary"),
      accent = gl.getUniformLocation(program, "u_accent"),
      time = gl.getUniformLocation(program, "u_time"),
      hover = gl.getUniformLocation(program, "u_hover");
    const primaryRgb = hexToRgb("#595a57"),
      secondaryRgb = hexToRgb("#B8B3A1"),
      accentRgb = hexToRgb("#ae482d");
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const hoverSurface = canvas.closest(".linkPage") as HTMLElement | null;
    const startedAt = performance.now();
    let frame = 0,
      hoverTarget = 0,
      hoverAmount = 0;
    const onEnter = () => {
      hoverTarget = 1;
    };
    const onLeave = () => {
      hoverTarget = 0;
    };
    hoverSurface?.addEventListener("pointerenter", onEnter);
    hoverSurface?.addEventListener("pointerleave", onLeave);
    const render = (now = startedAt) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5),
        width = Math.max(1, Math.round(canvas.clientWidth * dpr)),
        height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      hoverAmount += (hoverTarget - hoverAmount) * 0.07;
      gl.viewport(0, 0, width, height);
      gl.uniform2f(resolution, width, height);
      gl.uniform3f(primary, ...primaryRgb);
      gl.uniform3f(secondary, ...secondaryRgb);
      gl.uniform3f(accent, ...accentRgb);
      gl.uniform1f(time, reduceMotion ? 0 : (now - startedAt) / 1000);
      gl.uniform1f(hover, hoverAmount);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (!reduceMotion || Math.abs(hoverTarget - hoverAmount) > 0.001)
        frame = requestAnimationFrame(render);
    };
    render();
    const observer = new ResizeObserver(() => {
      if (reduceMotion) render();
    });
    observer.observe(canvas);
    return () => {
      observer.disconnect();
      hoverSurface?.removeEventListener("pointerenter", onEnter);
      hoverSurface?.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);
  return (
    <canvas ref={canvasRef} className="fractalNoiseCanvas" aria-hidden="true" />
  );
}
