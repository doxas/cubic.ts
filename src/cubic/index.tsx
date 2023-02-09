import { useEffect, useRef } from 'react';
import { clearScreenDown } from 'readline';
import { disposeEmitNodes } from 'typescript';
import GL3 from './lib/Cubic';
import { iCubicProps } from './lib/static/interface';

import vertexShaderSource from '../shader/main.vert';
import fragmentShaderSource from '../shader/main.frag';

export default function Cubic(props: iCubicProps): JSX.Element {
  const canvasReference = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasReference.current as HTMLCanvasElement;
    const gl3 = new GL3.Core(canvas);

    const clearColor = new GL3.Color(1.0, 0.0, 1.0, 1.0);
    const torus = GL3.Geometry.torus(64, 64, 0.25, 0.75);
    const mat = {
      m: GL3.Mat4.create(),
      v: GL3.Mat4.create(),
      p: GL3.Mat4.create(),
      vp: GL3.Mat4.create(),
      mvp: GL3.Mat4.create(),
      normal: GL3.Mat4.create(),
    };
    const cameraPosition = GL3.Vec3.create(0.0, 0.0, 5.0);
    const cameraCenter = GL3.Vec3.create(0.0, 0.0, 0.0);
    const cameraUpDirection = GL3.Vec3.create(0.0, 1.0, 0.0);
    const fovy = 45;
    const aspect = canvas.width / canvas.height;
    const near = 0.1;
    const far = 10.0;

    // create program
    const attLocation = ['position', 'normal'];
    const attStride = [3, 3];
    const uniLocation = ['mvpMatrix', 'normalMatrix'];
    const uniType = ['uniformMatrix4fv', 'uniformMatrix4fv'];
    const prg = gl3.createProgramFromSource(
      vertexShaderSource,
      fragmentShaderSource,
      attLocation,
      attStride,
      uniLocation,
      uniType
    );
    if (prg.ready !== true) {
      console.log('😇😇😇');
    }

    // create buffer
    const vbo = [gl3.createVbo(torus.position), gl3.createVbo(torus.normal)];
    const ibo = gl3.createIbo(torus.index);

    // setup
    gl3.setBackfaceCulling(true);
    gl3.setDepthTest(true);

    const eventSetting = () => {
      // events
    };

    const render = () => {
      requestAnimationFrame(render);

      gl3.clearScene(clearColor, 1.0);
      gl3.setViewport(0, 0, canvas.width, canvas.height);

      GL3.Mat4.identity(mat.m);
      GL3.Mat4.vpFromCameraProperty(cameraPosition, cameraCenter, cameraUpDirection, fovy, aspect, near, far, mat.v, mat.p, mat.vp);
      GL3.Mat4.multiply(mat.vp, mat.m, mat.mvp);
      GL3.Mat4.transpose(GL3.Mat4.inverse(mat.m), mat.normal);

      prg.useProgram();
      prg.enableAttribute(vbo, ibo);
      prg.provideUniform([mat.mvp, mat.normal]);

      gl3.drawElements(gl3.gl.TRIANGLES, torus.index.length);
    };

    eventSetting();
    render();

    const dispose = () => {};
    return dispose;
  });

  return (
    <>
      <canvas ref={canvasReference} className={props.className}></canvas>
    </>
  );
}
