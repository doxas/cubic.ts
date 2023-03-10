import { iCubicOption, iFramebuffer, iWebGLGlobalState } from '../static/interface';
import { ShaderProgram } from './ShaderProgram';
import { Color } from './Color';

export class Core {
  // global parameters
  private maxTextureUnit: number;

  // instance properties
  canvas: HTMLCanvasElement;
  parent?: HTMLElement | null;
  gl: WebGLRenderingContext | WebGL2RenderingContext;
  devicePixelRatio: number;
  extensions: any;
  private isWebGL2: boolean;
  private isConsoleOutput: boolean;

  /**
   * @constructor
   */
  constructor(canvas?: HTMLCanvasElement, webglOption?: any, cubicOption?: iCubicOption) {
    this.maxTextureUnit = 0;
    this.isWebGL2 = true;
    this.isConsoleOutput = true;
    this.devicePixelRatio = window.devicePixelRatio;

    if (canvas instanceof HTMLCanvasElement) {
      this.canvas = canvas;
    } else {
      this.canvas = document.createElement('canvas');
    }
    if (cubicOption != null) {
      if (cubicOption.webgl2 === false) {
        this.gl = this.canvas.getContext('webgl', webglOption) as WebGLRenderingContext;
        this.isWebGL2 = false;
      } else {
        this.gl = this.canvas.getContext('webgl2', webglOption) as WebGL2RenderingContext;
      }
      if (cubicOption?.consoleOutput === false) {
        this.isConsoleOutput = false;
      }
      if (cubicOption.devicePixelRatio != null && cubicOption.devicePixelRatio > 0) {
        this.devicePixelRatio = cubicOption.devicePixelRatio;
      }
    } else {
      this.gl = this.canvas.getContext('webgl2', webglOption) as WebGL2RenderingContext;
      if (this.gl == null) {
        this.gl = this.canvas.getContext('webgl', webglOption) as WebGLRenderingContext;
        this.isWebGL2 = false;
      }
    }
    if (this.gl != null) {
      this.maxTextureUnit = this.gl.getParameter(this.gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
      this.enableExtension();

      this.parent = this.canvas.parentElement;
      if (this.parent != null) {
        const bound = this.parent.getBoundingClientRect();
        this.setCanvasSize(bound.width, bound.height);
      }
    }
  }

  /**
   * ????????????????????????????????????
   */
  enableExtension(): void {
    this.extensions = {
      elementIndexUint: this.gl.getExtension('OES_element_index_uint'),
      textureFloat: this.gl.getExtension('OES_texture_float'),
      textureHalfFloat: this.gl.getExtension('OES_texture_half_float'),
      drawBuffers: this.gl.getExtension('WEBGL_draw_buffers'),
    };
  }

  /**
   * canvas ??????????????????????????????
   */
  setCanvasSize(width: number, height: number): void {
    if (this.canvas == null) {
      return;
    }
    this.canvas.width = width;
    this.canvas.height = height;
  }

  /**
   * ??????????????????????????????????????????
   */
  clearScene(color?: Color, depth?: number, stencil?: number): void {
    const gl = this.gl;
    let flg = gl.COLOR_BUFFER_BIT;
    if (color != null) {
      gl.clearColor(color.r, color.g, color.b, color.a);
    }
    if (depth != null) {
      gl.clearDepth(depth);
      flg = flg | gl.DEPTH_BUFFER_BIT;
    }
    if (stencil != null) {
      gl.clearStencil(stencil);
      flg = flg | gl.STENCIL_BUFFER_BIT;
    }
    gl.clear(flg);
  }

  /**
   * ???????????????????????????????????????
   */
  enableState(target: iWebGLGlobalState): void {
    if (this.gl == null) {
      return;
    }
    this.gl.enable(target);
  }

  /**
   * ???????????????????????????????????????
   */
  disableState(target: iWebGLGlobalState): void {
    if (this.gl == null) {
      return;
    }
    this.gl.disable(target);
  }

  /**
   * ??????????????????????????????????????????????????????????????????
   */
  setFaceCulling(flag: boolean): void {
    flag === true ? this.enableState(this.gl.CULL_FACE) : this.disableState(this.gl.CULL_FACE);
  }

  /**
   * ??????????????????????????????????????????????????????????????????
   */
  setDepthTest(flag: boolean): void {
    flag === true ? this.enableState(this.gl.DEPTH_TEST) : this.disableState(this.gl.DEPTH_TEST);
  }

  /**
   * ???????????????????????????????????????
   */
  setCullFaceBack(flag: boolean): void {
    flag === true ? this.gl.cullFace(this.gl.BACK) : this.disableState(this.gl.FRONT);
  }

  /**
   * ?????????????????????????????????
   */
  setViewport(x: number, y: number, width: number, height: number): void {
    if (this.gl == null) {
      return;
    }
    this.gl.viewport(x, y, width, height);
  }

  /**
   * gl.drawArrays ??????????????????????????????
   */
  drawArrays(primitive: number, vertexCount: number, offset: number = 0): void {
    this.gl.drawArrays(primitive, offset, vertexCount);
  }

  /**
   * gl.drawElements ??????????????????????????????
   */
  drawElements(primitive: number, indexLength: number, offset: number = 0): void {
    this.gl.drawElements(primitive, indexLength, this.gl.UNSIGNED_SHORT, offset);
  }

  /**
   * gl.drawElements ?????????????????????????????????gl.UNSIGNED_INT???
   */
  drawElementsInt(primitive: number, indexLength: number, offset: number = 0): void {
    this.gl.drawElements(primitive, indexLength, this.gl.UNSIGNED_INT, offset);
  }

  /**
   * VBO???Vertex Buffer Object????????????????????????
   */
  createVbo(data: number[] | Float32Array): WebGLBuffer {
    const gl = this.gl;
    const vbo = gl.createBuffer() as WebGLBuffer;
    const array = data instanceof Float32Array ? data : new Float32Array(data);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return vbo;
  }

  /**
   * IBO???Index Buffer Object????????????????????????
   */
  createIbo(data: number[] | Int16Array): WebGLBuffer {
    const gl = this.gl;
    const ibo = gl.createBuffer() as WebGLBuffer;
    const array = data instanceof Int16Array ? data : new Int16Array(data);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, array, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    return ibo;
  }

  /**
   * IBO???Index Buffer Object???????????????????????????gl.UNSIGNED_INT???
   */
  createIboInt(data: number[] | Int32Array): WebGLBuffer {
    const gl = this.gl;
    const ibo = gl.createBuffer() as WebGLBuffer;
    const array = data instanceof Int32Array ? data : new Int32Array(data);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, array, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    return ibo;
  }

  /**
   * ???????????????????????????????????????????????????????????????????????????????????? Promise ?????????
   */
  createTextureFromFile(source: string): Promise<WebGLTexture> {
    return new Promise((resolve) => {
      const gl = this.gl;
      const img = new Image();
      img.addEventListener(
        'load',
        () => {
          const texture = gl.createTexture() as WebGLTexture;
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
          gl.generateMipmap(gl.TEXTURE_2D);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.bindTexture(gl.TEXTURE_2D, null);
          resolve(texture);
        },
        false
      );
      img.src = source;
    });
  }

  /**
   * ???????????????????????????????????????????????????????????????
   */
  createTextureFromObject(object: any): WebGLTexture {
    const gl = this.gl;
    const texture = gl.createTexture() as WebGLTexture;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, object);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D, null);
    return texture;
  }

  /**
   * ???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? Promise ?????????
   */
  async createTextureCubeFromFile(sources: string[], targets: number[]): Promise<WebGLTexture> {
    const promises: Promise<HTMLImageElement>[] = [];
    const gl = this.gl;
    sources.forEach((source, index) => {
      promises.push(
        new Promise((resolve) => {
          const image = new Image();
          image.addEventListener(
            'load',
            () => {
              resolve(image);
            },
            false
          );
          image.src = source;
        })
      );
    });
    const images = await Promise.all(promises);
    const texture = gl.createTexture() as WebGLTexture;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
    targets.forEach((target, index) => {
      gl.texImage2D(target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[index]);
    });
    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
    return texture;
  }

  /**
   * ???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
   */
  createFramebuffer(width: number, height: number): iFramebuffer {
    const gl = this.gl;
    const frameBuffer = gl.createFramebuffer() as WebGLFramebuffer;
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    const depthRenderBuffer = gl.createRenderbuffer() as WebGLRenderbuffer;
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRenderBuffer);
    const texture = gl.createTexture() as WebGLTexture;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return { framebuffer: frameBuffer, renderbuffer: depthRenderBuffer, texture: texture };
  }

  /**
   * ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
   */
  createFramebufferStencil(width: number, height: number): iFramebuffer {
    const gl = this.gl;
    const frameBuffer = gl.createFramebuffer() as WebGLFramebuffer;
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    const depthStencilRenderBuffer = gl.createRenderbuffer() as WebGLRenderbuffer;
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthStencilRenderBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, width, height);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, depthStencilRenderBuffer);
    const texture = gl.createTexture() as WebGLTexture;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return { framebuffer: frameBuffer, renderbuffer: depthStencilRenderBuffer, texture: texture };
  }

  /**
   * ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
   */
  createFramebufferFloat(width: number, height: number): iFramebuffer | null {
    if (this.extensions == null || (this.extensions.textureFloat == null && this.extensions.textureHalfFloat == null)) {
      console.log('float texture not support');
      return null;
    }
    const gl = this.gl;
    const flg = this.extensions.textureFloat != null ? gl.FLOAT : this.extensions.textureHalfFloat.HALF_FLOAT_OES;
    const frameBuffer = gl.createFramebuffer() as WebGLFramebuffer;
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    const texture = gl.createTexture() as WebGLTexture;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, flg, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return { framebuffer: frameBuffer, texture: texture };
  }

  /**
   * ???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
   */
  createFramebufferCube(width: number, height: number, targets: number[]) {
    const gl = this.gl;
    const frameBuffer = gl.createFramebuffer() as WebGLFramebuffer;
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    const depthRenderBuffer = gl.createRenderbuffer() as WebGLRenderbuffer;
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRenderBuffer);
    const texture = gl.createTexture() as WebGLTexture;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
    targets.forEach((target) => {
      gl.texImage2D(target, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    });
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return { framebuffer: frameBuffer, renderbuffer: depthRenderBuffer, texture: texture };
  }

  /**
   * ????????????????????????????????????????????????????????????????????????????????????????????????
   */
  createProgramFromSource(vs: string, fs: string, attLocation: string[], attStride: number[], uniLocation: string[], uniType: string[]): ShaderProgram {
    const program = new ShaderProgram(this.gl, this.isWebGL2);
    const isReady = program.attachShader(vs, fs);
    if (isReady === true) {
      program.setupLocation(attLocation, attStride, uniLocation, uniType);
    } else {
      if (program.vertexShaderError != null) {
        console.error('cubic.ts: ', program.vertexShaderError);
      }
      if (program.fragmentShaderError != null) {
        console.error('cubic.ts: ', program.fragmentShaderError);
      }
      if (program.programLinkError != null) {
        console.error('cubic.ts: ', program.programLinkError);
      }
    }
    return program;
  }

  /**
   * ?????????????????????????????????????????????
   */
  dleteBuffer(buffer: any | WebGLBuffer): void {
    if (this.gl.isBuffer(buffer) !== true) {
      return;
    }
    this.gl.deleteBuffer(buffer);
    buffer = null;
  }

  /**
   * ????????????????????????????????????????????????
   */
  deleteTexture(texture: any | WebGLTexture): void {
    if (this.gl.isTexture(texture) !== true) {
      return;
    }
    this.gl.deleteTexture(texture);
    texture = null;
  }

  /**
   * ??????????????????????????????????????????????????????????????????
   */
  deleteFramebuffer(buffer: any | iFramebuffer): void {
    if (this.gl.isFramebuffer(buffer.framebuffer) === true) {
      this.gl.deleteFramebuffer(buffer.framebuffer);
    }
    if (buffer.renderbuffer != null && this.gl.isRenderbuffer(buffer.renderbuffer) === true) {
      this.gl.deleteFramebuffer(buffer.renderbuffer);
    }
    if (this.gl.isTexture(buffer.texture) === true) {
      this.gl.deleteTexture(buffer.texture);
    }
    buffer = null;
  }
}
