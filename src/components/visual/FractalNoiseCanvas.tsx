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
uniform vec3 u_hoverPrimary;
uniform vec3 u_secondary;
uniform float u_time;
uniform float u_interaction;
float hash21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float softNoise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);vec2 u=f*f*(3.0-2.0*f);float a=hash21(i);float b=hash21(i+vec2(1.,0.));float c=hash21(i+vec2(0.,1.));float d=hash21(i+vec2(1.,1.));return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}
mat2 rotate2d(float a){float s=sin(a);float c=cos(a);return mat2(c,-s,s,c);}
float turbulentFractal(vec2 p){float sum=0.;float weight=0.;float amplitude=1.;mat2 r=rotate2d(.055);for(int i=0;i<19;i++){float n=abs(softNoise(p)*2.-1.);sum+=n*amplitude;weight+=amplitude;p=r*p*1.72+vec2(3.17,-1.83);amplitude*=.63;}return sum/max(weight,.0001);}
void main(){
 float aspect=u_resolution.x/max(u_resolution.y,1.);vec2 p=(v_uv-.5)*vec2(aspect,1.);p*=mix(12.8,13.35,u_interaction);

 /* Clearly visible but still slow evolution at rest; hover adds a modest acceleration. */
 float evolution=u_time*mix(.13,.19,u_interaction);
 vec2 phase=vec2(sin(evolution*.91),cos(evolution*.77));
 vec2 phaseB=vec2(cos(evolution*.63),sin(evolution*1.03));

 vec2 warp=vec2(
   turbulentFractal(p*.34+vec2(7.1,2.3)+phase*mix(.42,.52,u_interaction)),
   turbulentFractal(p*.34+vec2(-3.8,8.6)+phaseB*mix(.42,.52,u_interaction))
 )-.5;
 vec2 topologyWarp=vec2(
   turbulentFractal(p*.17+vec2(13.7,-4.2)+phaseB*mix(.30,.38,u_interaction)),
   turbulentFractal(p*.17+vec2(-8.4,11.9)-phase*mix(.30,.38,u_interaction))
 )-.5;

 float n=turbulentFractal(p+warp*mix(.58,.66,u_interaction)+topologyWarp*mix(.28,.34,u_interaction));
 float ridgeCenter=.355+sin(evolution*.58)*mix(.008,.011,u_interaction);
 float ridge=abs(n-ridgeCenter);
 float network=1.-smoothstep(mix(.022,.019,u_interaction),mix(.105,.096,u_interaction),ridge);

 float detail=turbulentFractal(p*2.9+warp*.42+phase*.16);
 float micro=turbulentFractal(p*6.4+topologyWarp*.50-phaseB*.13);
 float grit=softNoise(p*38.+phase*.22);
 float speck=softNoise(p*82.-phaseB*.16);
 network*=smoothstep(.18,.60,detail)*.32+.68;
 network*=.80+micro*mix(.28,.34,u_interaction);
 network+=smoothstep(.61,.83,micro)*mix(.13,.17,u_interaction);
 network*=.88+grit*mix(.16,.20,u_interaction);
 network+=(speck-.5)*mix(.055,.072,u_interaction);
 network=pow(clamp(network,0.,1.),mix(1.22,1.12,u_interaction));

 vec3 activePrimary=mix(u_primary,u_hoverPrimary,u_interaction);
 gl_FragColor=vec4(mix(u_secondary,activePrimary,network),1.);
}`;

function hexToRgb(hex:string):[number,number,number]{const value=hex.trim().replace("#","");const normalized=value.length===3?value.split("").map(c=>c+c).join(""):value;const parsed=Number.parseInt(normalized,16);return[((parsed>>16)&255)/255,((parsed>>8)&255)/255,(parsed&255)/255];}
function compileShader(gl:WebGLRenderingContext,type:number,source:string){const shader=gl.createShader(type);if(!shader)return null;gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){console.error("Fractal shader compilation failed",gl.getShaderInfoLog(shader));gl.deleteShader(shader);return null;}return shader;}

export function FractalNoiseCanvas(){
 const canvasRef=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const canvas=canvasRef.current;if(!canvas)return;const gl=canvas.getContext("webgl",{alpha:false,antialias:false,powerPreference:"low-power"});if(!gl)return;
  const vs=compileShader(gl,gl.VERTEX_SHADER,vertexShaderSource);const fs=compileShader(gl,gl.FRAGMENT_SHADER,fragmentShaderSource);if(!vs||!fs)return;const program=gl.createProgram();if(!program)return;gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))return;
  const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);gl.useProgram(program);const position=gl.getAttribLocation(program,"a_position");gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
  const resolution=gl.getUniformLocation(program,"u_resolution"),primary=gl.getUniformLocation(program,"u_primary"),hoverPrimary=gl.getUniformLocation(program,"u_hoverPrimary"),secondary=gl.getUniformLocation(program,"u_secondary"),time=gl.getUniformLocation(program,"u_time"),interaction=gl.getUniformLocation(program,"u_interaction");
  const primaryRgb=hexToRgb("#292a27"),hoverPrimaryRgb=hexToRgb("#d85234"),secondaryRgb=hexToRgb("#B8B3A1");const reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;const canHover=window.matchMedia("(hover: hover) and (pointer: fine)").matches;const hoverTarget=canvas.closest(".linkPage") as HTMLElement|null;const startedAt=performance.now();let frame=0,target=0,value=0;
  const enter=()=>{if(canHover)target=1;};const leave=()=>{target=0;};hoverTarget?.addEventListener("pointerenter",enter);hoverTarget?.addEventListener("pointerleave",leave);
  const render=(now=startedAt)=>{const dpr=Math.min(window.devicePixelRatio||1,1.5),width=Math.max(1,Math.round(canvas.clientWidth*dpr)),height=Math.max(1,Math.round(canvas.clientHeight*dpr));if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}gl.viewport(0,0,width,height);gl.uniform2f(resolution,width,height);gl.uniform3f(primary,...primaryRgb);gl.uniform3f(hoverPrimary,...hoverPrimaryRgb);gl.uniform3f(secondary,...secondaryRgb);gl.uniform1f(time,reduceMotion?0:(now-startedAt)/1000);value=reduceMotion?target:value+(target-value)*.065;gl.uniform1f(interaction,value);gl.drawArrays(gl.TRIANGLES,0,6);if(!reduceMotion)frame=requestAnimationFrame(render);};
  render();const observer=new ResizeObserver(()=>{if(reduceMotion)render();});observer.observe(canvas);return()=>{observer.disconnect();hoverTarget?.removeEventListener("pointerenter",enter);hoverTarget?.removeEventListener("pointerleave",leave);cancelAnimationFrame(frame);gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);};
 },[]);
 return <canvas ref={canvasRef} className="fractalNoiseCanvas" aria-hidden="true"/>;
}
