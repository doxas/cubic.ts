import { Vec2 } from "./Vec2";
import { Vec3 } from "./Vec3";
import { Mat4 } from "./Mat4";
import { Qtn } from "./Qtn";

import { ORBIT_DEFAULT_DISTANCE, ORBIT_DEFAULT_MIN_DISTANCE, ORBIT_DEFAULT_MAX_DISTANCE, ORBIT_DEFAULT_MOVE_SCALE } from "../static/constant";
import { iOrbitOption } from "../static/interface";

export class Orbit {
  target: HTMLElement;
  distance: number;
  minDistance: number;
  maxDistance: number;
  moveScale: number;
  position: Float32Array;
  center: Float32Array;
  upDirection: Float32Array;
  defaultPosition: Float32Array;
  defaultCenter: Float32Array;
  defaultUpDirection: Float32Array;
  movePosition: Float32Array;
  rotateX: number;
  rotateY: number;
  scale: number;
  isDown: boolean;
  prevPosition: Float32Array;
  offsetPosition: Float32Array;
  qt: Float32Array;
  qtx: Float32Array;
  qty: Float32Array;

  /**
   * @constructor
   */
  constructor(target: HTMLElement, option: iOrbitOption = {}) {
    this.target = target;
    this.distance = option.distance ?? ORBIT_DEFAULT_DISTANCE;
    this.minDistance = option.min ?? ORBIT_DEFAULT_MIN_DISTANCE;
    this.maxDistance = option.max ?? ORBIT_DEFAULT_MAX_DISTANCE;
    this.moveScale = option.move ?? ORBIT_DEFAULT_MOVE_SCALE;
    this.position = Vec3.create(0.0, 0.0, this.distance);
    this.center = Vec3.create(0.0, 0.0, 0.0);
    this.upDirection = Vec3.create(0.0, 1.0, 0.0);
    this.defaultPosition = Vec3.create(0.0, 0.0, this.distance);
    this.defaultCenter = Vec3.create(0.0, 0.0, 0.0);
    this.defaultUpDirection = Vec3.create(0.0, 1.0, 0.0);
    this.movePosition = Vec3.create(0.0, 0.0, 0.0);
    this.rotateX = 0.0;
    this.rotateY = 0.0;
    this.scale = 0.0;
    this.isDown = false;
    this.prevPosition = Vec2.create(0, 0);
    this.offsetPosition = Vec2.create(0, 0);
    this.qt = Qtn.create();
    this.qtx = Qtn.create();
    this.qty = Qtn.create();

    // self binding
    this.pointerInteractionStart = this.pointerInteractionStart.bind(this);
    this.pointerInteractionMove = this.pointerInteractionMove.bind(this);
    this.pointerInteractionEnd = this.pointerInteractionEnd.bind(this);
    this.wheelScroll = this.wheelScroll.bind(this);

    // event
    this.target.addEventListener('pointerdown', this.pointerInteractionStart, false);
    this.target.addEventListener('pointermove', this.pointerInteractionMove, false);
    this.target.addEventListener('pointerup', this.pointerInteractionEnd, false);
    this.target.addEventListener('wheel', this.wheelScroll, false);
    this.target.addEventListener('contextmenu', (event) => {
      event.preventDefault();
    }, false);
  }
  /**
   * ボタンが押された際のイベント
   */
  pointerInteractionStart(evt: PointerEvent): void {
    this.isDown = true;
    const bound = this.target.getBoundingClientRect();
    this.prevPosition = Vec2.create(
      evt.clientX - bound.left,
      evt.clientY - bound.top,
    );
  }
  /**
   * ポインターが移動した際のイベント
   */
  pointerInteractionMove(evt: PointerEvent): void {
    if (this.isDown !== true) { return; }
    const bound = this.target.getBoundingClientRect();
    const w = bound.width;
    const h = bound.height;
    const x = evt.clientX - bound.left;
    const y = evt.clientY - bound.top;
    const s = 1.0 / Math.min(w, h);
    this.offsetPosition = Vec2.create(
      x - this.prevPosition[0],
      y - this.prevPosition[1],
    );
    this.prevPosition = Vec2.create(x, y);
    switch (evt.buttons) {
      case 1:
        // 左ボタン
        this.rotateX += this.offsetPosition[0] * s;
        this.rotateY += this.offsetPosition[1] * s;
        this.rotateX = this.rotateX % 1.0;
        this.rotateY = Math.min(Math.max(this.rotateY % 1.0, -0.25), 0.25);
        break;
      case 2:
        // 右ボタン
        const eyeOffset = Vec3.create(
          this.offsetPosition[0],
          -this.offsetPosition[1],
          0.0,
        );
        const rotateEye = Qtn.toVecIII(eyeOffset, this.qt);
        this.movePosition[0] -= rotateEye[0] * s * this.moveScale;
        this.movePosition[1] -= rotateEye[1] * s * this.moveScale;
        this.movePosition[2] -= rotateEye[2] * s * this.moveScale;
        break;
    }
  }
  /**
   * ボタンが離された際のイベント
   */
  pointerInteractionEnd(): void {
    this.isDown = false;
  }
  /**
   * スクロール操作に対するイベント
   */
  wheelScroll(evt: WheelEvent): void {
    const w = evt.deltaY;
    if (w > 0) {
      this.scale = 0.5;
    } else if (w < 0) {
      this.scale = -0.5;
    }
  }
  /**
   * 現在のパラメータからビュー行列を生成して返す
   */
  update(): Float32Array {
    const PI2 = Math.PI * 2.0;
    const v = Vec3.create(1.0, 0.0, 0.0);
    const u = Vec3.create(0.0, 1.0, 0.0);
    // scale
    this.scale *= 0.7;
    this.distance += this.scale;
    this.distance = Math.min(Math.max(this.distance, this.minDistance), this.maxDistance);
    this.defaultPosition[2] = this.distance;
    // rotate
    Qtn.identity(this.qt);
    Qtn.identity(this.qtx);
    Qtn.identity(this.qty);
    Qtn.rotate(this.rotateX * PI2, u, this.qtx);
    Qtn.toVecIII(v, this.qtx, v);
    Qtn.rotate(this.rotateY * PI2, v, this.qty);
    Qtn.multiply(this.qtx, this.qty, this.qt)
    Qtn.toVecIII(this.defaultPosition, this.qt, this.position);
    Qtn.toVecIII(this.defaultUpDirection, this.qt, this.upDirection);
    // translate
    this.position[0] += this.movePosition[0];
    this.position[1] += this.movePosition[1];
    this.position[2] += this.movePosition[2];
    this.center[0] = this.defaultCenter[0] + this.movePosition[0];
    this.center[1] = this.defaultCenter[1] + this.movePosition[1];
    this.center[2] = this.defaultCenter[2] + this.movePosition[2];

    return Mat4.lookAt(this.position, this.center, this.upDirection);
  }
}

