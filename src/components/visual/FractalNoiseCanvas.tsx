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
uniform float u_accentHover;

float hash21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float softNoise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);vec2 u=f*f*(3.0-2.0*f);float a=hash21(i);float b=hash21(i+vec2(1.,0.));float c=hash21(i+vec2(0.,1.));float d=hash21(i+vec2(1.,1.));return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}
mat2 rotate2d(float a){float s=sin(a);float c=cos(a);return mat2(c,-s,s,c);}
float turbulentFractal(vec2 p){float sum=0.;float weight=0.;float amplitude=1.;mat2 r=rotate2d(.055);for(int i=0;i<19;i++){float n=abs(softNoise(p)*2.-1.);sum+=n*amplitude;weight+=amplitude;p=r*p*1.72+vec2(3.17,-1.83);amplitude*=.63;}return sum/max(weight,.0001);}

void main(){
  float aspect=u_resolution.x/max(u_resolution.y,1.);
  vec2 p=(v_uv-.5)*vec2(aspect,1.);
  p*=14.0;

  float hoverResponse=smoothstep(0.0,.82,u_hover);
  float accentResponse=smoothstep(0.0,.82,u_accentHover);
  float evolution=u_time*.22;
  vec2 phase=vec2(sin(evolution*.91),cos(evolution*.77));
  vec2 phaseB=vec2(cos(evolution*.63),sin(evolution*1.03));
  vec2 phaseC=vec2(sin(evolution*.47),cos(evolution*1.21));

  vec2 hoverDrift=vec2(sin(evolution*1.7),cos(evolution*1.31))*hoverResponse*.18;
  vec2 warp=vec2(
    turbulentFractal(p*.34+vec2(7.1,2.3)+phase*.72+hoverDrift),
    turbulentFractal(p*.34+vec2(-3.8,8.6)+phaseB*.72-hoverDrift)
  )-.5;
  vec2 topologyWarp=vec2(
    turbulentFractal(p*.17+vec2(13.7,-4.2)+phaseB*.56),
    turbulentFractal(p*.17+vec2(-8.4,11.9)-phase*.56)
  )-.5;

  float warpDepth=mix(.72,1.08,hoverResponse);
  float topologyDepth=mix(.34,.58,hoverResponse);
  float broad=turbulentFractal(p+warp*warpDepth+topologyWarp*topologyDepth+phaseC*.08);
  float fine=turbulentFractal(p*mix(2.15,2.48,hoverResponse)+warp*mix(.48,.68,hoverResponse)+phase*.28);
  float micro=turbulentFractal(p*mix(5.2,6.4,hoverResponse)+topologyWarp*.40-phaseB*.22);
  float wash=turbulentFractal(p*.68+warp*.55-topologyWarp*.25+phaseB*.18);

  float network=broad*.58+fine*.29+micro*.13;
  network=mix(network,network*(.80+wash*.30),mix(.35,.50,hoverResponse));

  float contrastPulse=.5+.5*sin(evolution*.71+1.1);
  float brightnessPulse=.5+.5*sin(evolution*.49-0.8);
  float gritPulse=.5+.5*sin(evolution*.93+2.2);
  float lowThreshold=mix(.285,.325,contrastPulse)-hoverResponse*.045;
  float highThreshold=mix(.735,.675,contrastPulse)+hoverResponse*.045;
  network=smoothstep(lowThreshold,highThreshold,network);
  network=1.0-network;
  network=clamp((network-.5)*mix(1.0,1.34,hoverResponse)+.5,0.0,1.0);

  float gritScale=mix(25.0,32.0,gritPulse)*mix(1.0,1.22,hoverResponse);
  float speckScale=mix(52.0,66.0,1.0-gritPulse)*mix(1.0,1.30,hoverResponse);
  float grit=softNoise(p*gritScale+phase*.55+phaseC*.25+hoverDrift*2.0);
  float speck=softNoise(p*speckScale-phaseB*.42+phaseC*.18-hoverDrift*3.0);
  float gritStrength=mix(.16,.27,gritPulse)+hoverResponse*.12;
  network*=mix(.78,.69,gritPulse)+grit*gritStrength;
  network+=(speck-.5)*(mix(.025,.052,gritPulse)+hoverResponse*.075);
  network+=mix(-.035,.045,brightnessPulse);
  network=clamp(network,0.0,1.0);

  vec3 structureColor=mix(u_primary,u_accent,accentResponse*.72);
  float restDensity=.82;
  float hoverDensity=mix(restDensity,.48,hoverResponse);
  vec3 normalColor=mix(u_secondary,structureColor,network*hoverDensity);
  vec3 hoverWash=mix(u_secondary,structureColor,network*.40);
  float offWhiteLift=hoverResponse*mix(.62,.56,accentResponse);
  vec3 finalColor=mix(normalColor,hoverWash,offWhiteLift);

  float relief=(broad-.5)*hoverResponse*.22+(fine-.5)*hoverResponse*.12;
  finalColor=clamp(finalColor+vec3(relief),0.0,1.0);
  gl_FragColor=vec4(finalColor,1.0);
}`;

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.trim().replace("#", "");
  const normalized = value.length === 3 ? value.split("").map((c) => c + c).join("") : value;
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

type FractalNoiseCanvasProps = {
  hoverMode?: "idle" | "contrast" | "accent";
};

export function FractalNoiseCanvas({ hoverMode = "idle" }: FractalNoiseCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hoverModeRef = useRef(hoverMode);

  useEffect(() => {
    hoverModeRef.current = hoverMode;
  }, [hoverMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: false, antialias: false, powerPreference: "low-power" });
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
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    gl.useProgram(program);
    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const resolution = gl.getUniformLocation(program, "u_resolution"),
      primary = gl.getUniformLocation(program, "u_primary"),
      secondary = gl.getUniformLocation(program, "u_secondary"),
      accent = gl.getUniformLocation(program, "u_accent"),
      time = gl.getUniformLocation(program, "u_time"),
      hover = gl.getUniformLocation(program, "u_hover"),
      accentHover = gl.getUniformLocation(program, "u_accentHover");

    const primaryRgb = hexToRgb("#595a57"),
      secondaryRgb = hexToRgb("#B8B3A1"),
      accentRgb = hexToRgb("#D84517");
    const startedAt = performance.now();
    let frame = 0, hoverAmount = 0, accentAmount = 0;

    const render = (now = startedAt) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5),
        width = Math.max(1, Math.round(canvas.clientWidth * dpr)),
        height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }

      const mode = hoverModeRef.current;
      const hoverTarget = mode === "idle" ? 0 : 1;
      const accentTarget = mode === "accent" ? 1 : 0;
      const hoverEase = hoverTarget > hoverAmount ? 0.28 : 0.24;
      const accentEase = accentTarget > accentAmount ? 0.28 : 0.24;
      hoverAmount += (hoverTarget - hoverAmount) * hoverEase;
      accentAmount += (accentTarget - accentAmount) * accentEase;

      gl.viewport(0, 0, width, height);
      gl.uniform2f(resolution, width, height);
      gl.uniform3f(primary, ...primaryRgb);
      gl.uniform3f(secondary, ...secondaryRgb);
      gl.uniform3f(accent, ...accentRgb);
      gl.uniform1f(time, (now - startedAt) / 1000);
      gl.uniform1f(hover, hoverAmount);
      gl.uniform1f(accentHover, accentAmount);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      frame = requestAnimationFrame(render);
    };

    render();
    const observer = new ResizeObserver(() => {});
    observer.observe(canvas);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return <canvas ref={canvasRef} className="fractalNoiseCanvas" aria-hidden="true" />;
}
