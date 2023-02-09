import React from 'react';

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
  type: string;
}

export type iWebGLGlobalState =
  | WebGLRenderingContext['BLEND']
  | WebGLRenderingContext['CULL_FACE']
  | WebGLRenderingContext['DEPTH_TEST']
  | WebGLRenderingContext['DITHER']
  | WebGLRenderingContext['POLYGON_OFFSET_FILL']
  | WebGLRenderingContext['SAMPLE_ALPHA_TO_COVERAGE']
  | WebGLRenderingContext['SAMPLE_COVERAGE']
  | WebGLRenderingContext['SCISSOR_TEST']
  | WebGLRenderingContext['STENCIL_TEST'];
