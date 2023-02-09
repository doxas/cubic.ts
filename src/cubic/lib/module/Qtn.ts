import { Vec3 } from './Vec3';
import { Mat4 } from './Mat4';

export class Qtn {
  /**
   * ４つの要素からなるクォータニオンのデータ構造を生成する（虚部 x, y, z, 実部 w の順序で定義）
   */
  static create(): Float32Array {
    return new Float32Array(4);
  }
  /**
   * コピー（第２引数省略時は clone）
   */
  static copy(from: Float32Array, to?: Float32Array): Float32Array {
    const out = to ?? Qtn.create();
    out[0] = from[0];
    out[1] = from[1];
    out[2] = from[2];
    out[3] = from[3];
    return out;
  }
  /**
   * クォータニオンを初期化する
   */
  static identity(reference?: Float32Array): Float32Array {
    const out = reference ?? Qtn.create();
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
  }
  /**
   * 共役四元数を生成して返す
   */
  static inverse(qtn: Float32Array, reference?: Float32Array): Float32Array {
    const out = reference ?? Qtn.create();
    out[0] = -qtn[0];
    out[1] = -qtn[1];
    out[2] = -qtn[2];
    out[3] = qtn[3];
    return out;
  }
  /**
   * 虚部を正規化して返す
   */
  static normalize(qtn: Float32Array): Float32Array {
    const x = qtn[0],
      y = qtn[1],
      z = qtn[2];
    let l = Math.sqrt(x * x + y * y + z * z);
    if (l === 0) {
      qtn[0] = 0;
      qtn[1] = 0;
      qtn[2] = 0;
    } else {
      l = 1 / l;
      qtn[0] = x * l;
      qtn[1] = y * l;
      qtn[2] = z * l;
    }
    return qtn;
  }
  /**
   * クォータニオンを乗算した結果を返す
   */
  static multiply(qtn0: Float32Array, qtn1: Float32Array, reference?: Float32Array): Float32Array {
    const out = reference ?? Qtn.create();
    const ax = qtn0[0],
      ay = qtn0[1],
      az = qtn0[2],
      aw = qtn0[3],
      bx = qtn1[0],
      by = qtn1[1],
      bz = qtn1[2],
      bw = qtn1[3];
    out[0] = ax * bw + aw * bx + ay * bz - az * by;
    out[1] = ay * bw + aw * by + az * bx - ax * bz;
    out[2] = az * bw + aw * bz + ax * by - ay * bx;
    out[3] = aw * bw - ax * bx - ay * by - az * bz;
    return out;
  }
  /**
   * クォータニオンに回転を適用し返す
   */
  static rotate(angle: number, axis: Float32Array, reference?: Float32Array): Float32Array {
    const out = reference ?? Qtn.create();
    let a = axis[0],
      b = axis[1],
      c = axis[2];
    const sq = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]);
    if (sq !== 0) {
      const l = 1 / sq;
      a *= l;
      b *= l;
      c *= l;
    }
    const s = Math.sin(angle * 0.5);
    out[0] = a * s;
    out[1] = b * s;
    out[2] = c * s;
    out[3] = Math.cos(angle * 0.5);
    return out;
  }
  /**
   * ベクトルにクォータニオンを適用し返す
   */
  static toVecIII(vec: Float32Array, qtn: Float32Array, reference?: Float32Array): Float32Array {
    const out = reference ?? Vec3.create();
    const qp = Qtn.create();
    const qq = Qtn.create();
    const qr = Qtn.create();
    Qtn.inverse(qtn, qr);
    qp[0] = vec[0];
    qp[1] = vec[1];
    qp[2] = vec[2];
    Qtn.multiply(qr, qp, qq);
    Qtn.multiply(qq, qtn, qr);
    out[0] = qr[0];
    out[1] = qr[1];
    out[2] = qr[2];
    return out;
  }
  /**
   * 4x4 行列にクォータニオンを適用し返す
   */
  static toMatIV(qtn: Float32Array, reference?: Float32Array): Float32Array {
    const out = reference ?? Mat4.create();
    const x = qtn[0],
      y = qtn[1],
      z = qtn[2],
      w = qtn[3];
    const x2 = x + x,
      y2 = y + y,
      z2 = z + z;
    const xx = x * x2,
      xy = x * y2,
      xz = x * z2;
    const yy = y * y2,
      yz = y * z2,
      zz = z * z2;
    const wx = w * x2,
      wy = w * y2,
      wz = w * z2;
    out[0] = 1 - (yy + zz);
    out[1] = xy - wz;
    out[2] = xz + wy;
    out[3] = 0;
    out[4] = xy + wz;
    out[5] = 1 - (xx + zz);
    out[6] = yz - wx;
    out[7] = 0;
    out[8] = xz - wy;
    out[9] = yz + wx;
    out[10] = 1 - (xx + yy);
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  /**
   * ２つのクォータニオンの球面線形補間を行った結果を返す
   */
  static slerp(qtn0: Float32Array, qtn1: Float32Array, time: number, reference?: Float32Array): Float32Array {
    const out = reference ?? Qtn.create();
    const ht = qtn0[0] * qtn1[0] + qtn0[1] * qtn1[1] + qtn0[2] * qtn1[2] + qtn0[3] * qtn1[3];
    let hs = 1.0 - ht * ht;
    if (hs <= 0.0) {
      out[0] = qtn0[0];
      out[1] = qtn0[1];
      out[2] = qtn0[2];
      out[3] = qtn0[3];
    } else {
      hs = Math.sqrt(hs);
      if (Math.abs(hs) < 0.0001) {
        out[0] = qtn0[0] * 0.5 + qtn1[0] * 0.5;
        out[1] = qtn0[1] * 0.5 + qtn1[1] * 0.5;
        out[2] = qtn0[2] * 0.5 + qtn1[2] * 0.5;
        out[3] = qtn0[3] * 0.5 + qtn1[3] * 0.5;
      } else {
        let ph = Math.acos(ht);
        let pt = ph * time;
        let t0 = Math.sin(ph - pt) / hs;
        let t1 = Math.sin(pt) / hs;
        out[0] = qtn0[0] * t0 + qtn1[0] * t1;
        out[1] = qtn0[1] * t0 + qtn1[1] * t1;
        out[2] = qtn0[2] * t0 + qtn1[2] * t1;
        out[3] = qtn0[3] * t0 + qtn1[3] * t1;
      }
    }
    return out;
  }
}
