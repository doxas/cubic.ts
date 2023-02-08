import { iAttributeLocation, iUniformLocation, iUniformProvider } from '../static/interface';
import { UNIFORM_TYPE } from '../static/constant';

export class ShaderProgram {
  ready: boolean;
  vertexShader: WebGLShader | null;
  fragmentShader: WebGLShader | null;
  object: WebGLProgram | null;
  attribute: iAttributeLocation[] | null;
  uniform: iUniformLocation[] | null;
  vertexShaderError: string | null;
  fragmentShaderError: string | null;
  programLinkError: string | null;
  private gl: WebGLRenderingContext | WebGL2RenderingContext;
  private isWebGL2: boolean;

  /**
   * @constructor
   */
  constructor(gl: WebGLRenderingContext, webgl2Mode: boolean = true) {
    this.gl = gl;
    this.isWebGL2 = webgl2Mode;

    this.ready = false;
    this.vertexShader = null;
    this.fragmentShader = null;
    this.object = null;
    this.attribute = null;
    this.uniform = null;
    this.vertexShaderError = null;
    this.fragmentShaderError = null;
    this.programLinkError = null;
  }

  /**
   * シェーダのソースコードを文字列で引数から取得しシェーダオブジェクトを生成する
   */
  private createShader(source: string, type: WebGLRenderingContext['VERTEX_SHADER'] | WebGLRenderingContext['FRAGMENT_SHADER']): WebGLShader | null {
    const gl = this.gl;
    const shader = type === gl.VERTEX_SHADER ? (gl.createShader(gl.VERTEX_SHADER) as WebGLShader) : (gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      return shader;
    } else {
      const error = gl.getShaderInfoLog(shader) as string;
      if (type === gl.VERTEX_SHADER) {
        this.vertexShaderError = error;
      } else {
        this.fragmentShaderError = error;
      }
      return null;
    }
  }

  /**
   * シェーダオブジェクトを引数から取得しプログラムオブジェクトを生成する
   */
  attachShader(vertexShaderSource: string, fragmentShaderSource: string): boolean {
    const gl = this.gl;
    const vertexShader = this.createShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = this.createShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
    if (vertexShader == null || fragmentShader == null) {
      this.ready = false;
    } else {
      const program = gl.createProgram() as WebGLProgram;
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
        this.ready = true;
      } else {
        this.programLinkError = this.gl.getProgramInfoLog(program);
        this.ready = false;
      }
    }
    return this.ready;
  }

  /**
   * ロケーションを取得する
   */
  setupLocation(attLocation: string[], attStride: number[], uniLocation: string[], uniType: (typeof UNIFORM_TYPE)[]): void {
    if (this.object == null) {
      return;
    }
    const gl = this.gl;
    const object = this.object;
    this.attribute = [];
    attLocation.forEach((location, index) => {
      if (this.attribute == null) {
        return;
      }
      this.attribute.push({
        location: gl.getAttribLocation(object, location),
        stride: attStride[index],
      });
    });
    this.uniform = [];
    uniLocation.forEach((location, index) => {
      if (this.uniform == null) {
        return;
      }
      this.uniform.push({
        location: gl.getUniformLocation(object, location),
        type: uniType[index],
      });
    });
  }

  /**
   * 自身の内部プロパティとして存在するプログラムオブジェクトを設定する
   */
  useProgram(): void {
    this.gl.useProgram(this.object);
  }

  /**
   * VBO と IBO をバインドして有効化する
   */
  enableAttribute(vbo: WebGLBuffer[], ibo?: WebGLBuffer): void {
    const gl = this.gl;
    if (this.attribute != null) {
      this.attribute.forEach((attribute, index) => {
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo[index]);
        gl.enableVertexAttribArray(attribute.location);
        gl.vertexAttribPointer(attribute.location, attribute.stride, gl.FLOAT, false, 0, 0);
      });
    }
    if (ibo != null) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    }
  }

  /**
   * VBO と IBO を無効化する
   */
  disableAttribute(): void {
    const gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    if (this.attribute != null) {
      this.attribute.forEach((attribute) => {
        gl.disableVertexAttribArray(attribute.location);
      });
    }
  }

  /**
   * ユニフォーム変数に値を設定する
   */
  provideUniform(mixed: any[]): void {
    const gl = this.gl;
    if (this.uniform != null) {
      this.uniform.forEach((uniform, index) => {
        const provider = uniform.type as any as keyof iUniformProvider;
        if (gl[provider] != null) {
          const providerMethod = gl[provider] as Function;
          if (uniform.type.includes('Matrix') === true) {
            providerMethod(uniform.location, false, mixed[index]);
          } else {
            providerMethod(uniform.location, mixed[index]);
          }
        }
      });
    }
  }

  /**
   *
   */
  dispose() {}
}
