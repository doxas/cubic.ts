import React from 'react';
import { UNIFORM_TYPE } from './constant';

export interface iCubicProps {
  children?: React.ReactNode;
  className?: string;
}

export interface iCubicOption {
  webgl2?: boolean;
  consoleOutput?: boolean;
  devicePixelRatio?: number;
}

export interface iColorFloat {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface iGeometryAttribute {
  position: number[];
  normal: number[];
  color: number[];
  texCoord: number[];
  index: number[];
}

export interface iFramebuffer {
  framebuffer: WebGLFramebuffer;
  renderbuffer?: WebGLRenderbuffer;
  texture: WebGLTexture;
}

export interface iAttributeLocation {
  location: number;
  stride: number;
}

export interface iUniformLocation {
  location: WebGLUniformLocation | null;
  type: typeof UNIFORM_TYPE;
}

export interface iUniformProvider {
  uniform1i: (w: WebGLUniformLocation, v: any) => {};
  uniform1iv: (w: WebGLUniformLocation, v: any) => {};
  uniform1f: (w: WebGLUniformLocation, v: any) => {};
  uniform1fv: (w: WebGLUniformLocation, v: any) => {};
  uniform2i: (w: WebGLUniformLocation, v: any) => {};
  uniform2iv: (w: WebGLUniformLocation, v: any) => {};
  uniform2f: (w: WebGLUniformLocation, v: any) => {};
  uniform2fv: (w: WebGLUniformLocation, v: any) => {};
  uniform3i: (w: WebGLUniformLocation, v: any) => {};
  uniform3iv: (w: WebGLUniformLocation, v: any) => {};
  uniform3f: (w: WebGLUniformLocation, v: any) => {};
  uniform3fv: (w: WebGLUniformLocation, v: any) => {};
  uniform4i: (w: WebGLUniformLocation, v: any) => {};
  uniform4iv: (w: WebGLUniformLocation, v: any) => {};
  uniform4f: (w: WebGLUniformLocation, v: any) => {};
  uniform4fv: (w: WebGLUniformLocation, v: any) => {};
  uniformMatrix2fv: (w: WebGLUniformLocation, t: boolean, v: any) => {};
  uniformMatrix3fv: (w: WebGLUniformLocation, t: boolean, v: any) => {};
  uniformMatrix4fv: (w: WebGLUniformLocation, t: boolean, v: any) => {};
}
