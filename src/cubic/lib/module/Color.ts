import { iColorFloat } from '../static/interface';
import { saturate } from './Util';

export class Color {
  r: number;
  g: number;
  b: number;
  a: number;

  constructor(r: number = 0.0, g: number = 0.0, b: number = 0.0, a: number = 1.0) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }
  getFloat(): iColorFloat {
    return {
      r: this.r,
      g: this.g,
      b: this.b,
      a: this.a,
    };
  }
  getFloatArray(): [number, number, number, number] {
    return [this.r, this.g, this.b, this.a];
  }
  getRGBStyle(): string {
    const r = Math.floor(this.r * 255);
    const g = Math.floor(this.g * 255);
    const b = Math.floor(this.b * 255);
    return `rgb(${r},${g},${b})`;
  }
  getRGBAStyle(): string {
    const r = Math.floor(this.r * 255);
    const g = Math.floor(this.g * 255);
    const b = Math.floor(this.b * 255);
    return `rgba(${r},${g},${b},${this.a})`;
  }
  setHSVA(h: number, s: number, v: number, a: number): Color {
    const ss = saturate(s);
    const th = h % 360;
    const i = Math.floor(th / 60);
    const f = th / 60 - i;
    const m = v * (1 - ss);
    const n = v * (1 - ss * f);
    const k = v * (1 - ss * (1 - f));
    this.r = [v, n, m, m, k, v][i];
    this.g = [k, v, v, n, m, m][i];
    this.b = [m, m, k, v, v, n][i];
    this.a = a;
    return this;
  }
}
