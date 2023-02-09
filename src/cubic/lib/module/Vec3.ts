export class Vec3 {
  /**
   * 3 つの要素を持つベクトルを生成する
   */
  static create(x: number = 0, y: number = 0, z: number = 0): Float32Array {
    const v = new Float32Array(3);
    v[0] = x;
    v[1] = y;
    v[2] = z;
    return v;
  }
  /**
   * 要素に値を設定する
   */
  static set(v: Float32Array, x: number = 0, y: number = 0, z: number = 0): Float32Array {
    v[0] = x;
    v[1] = y;
    v[2] = z;
    return v;
  }
  /**
   * 要素に値を設定する
   */
  static setScalar(v: Float32Array, f: number = 0): Float32Array {
    v[0] = f;
    v[1] = f;
    v[2] = f;
    return v;
  }
  /**
   * コピー（第２引数省略時は clone）
   */
  static copy(from: Float32Array, to?: Float32Array): Float32Array {
    const out = to ?? Vec3.create();
    out[0] = from[0];
    out[1] = from[1];
    out[2] = from[2];
    return out;
  }
  /**
   * 要素同士を加算する
   */
  static add(v0: Float32Array, v1: Float32Array): Float32Array {
    v0[0] += v1[0];
    v0[1] += v1[1];
    v0[2] += v1[2];
    return v0;
  }
  /**
   * 要素同士を減算する
   */
  static sub(v0: Float32Array, v1: Float32Array): Float32Array {
    v0[0] -= v1[0];
    v0[1] -= v1[1];
    v0[2] -= v1[2];
    return v0;
  }
  /**
   * 要素同士を乗算する
   */
  static mul(v0: Float32Array, v1: Float32Array): Float32Array {
    v0[0] *= v1[0];
    v0[1] *= v1[1];
    v0[2] *= v1[2];
    return v0;
  }
  /**
   * 要素同士を除算する
   */
  static div(v0: Float32Array, v1: Float32Array): Float32Array {
    v0[0] /= v1[0];
    v0[1] /= v1[1];
    v0[2] /= v1[2];
    return v0;
  }
  /**
   * ベクトルの長さ（大きさ）を返す
   */
  static len(v: Float32Array): number {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  }
  /**
   * ２つの座標（始点・終点）を結ぶベクトルを返す
   */
  static distance(v0: Float32Array, v1: Float32Array): Float32Array {
    const n = Vec3.create();
    n[0] = v1[0] - v0[0];
    n[1] = v1[1] - v0[1];
    n[2] = v1[2] - v0[2];
    return n;
  }
  /**
   * ベクトルを正規化した結果を返す
   */
  static normalize(v: Float32Array): Float32Array {
    const n = Vec3.create();
    const l = Vec3.len(v);
    if (l > 0) {
      const i = 1.0 / l;
      n[0] = v[0] * i;
      n[1] = v[1] * i;
      n[2] = v[2] * i;
    } else {
      n[0] = 0.0;
      n[1] = 0.0;
      n[2] = 0.0;
    }
    return n;
  }
  /**
   * ２つのベクトルの内積の結果を返す
   */
  static dot(v0: Float32Array, v1: Float32Array): number {
    return v0[0] * v1[0] + v0[1] * v1[1] + v0[2] * v1[2];
  }
  /**
   * ２つのベクトルの外積の結果を返す
   */
  static cross(v0: Float32Array, v1: Float32Array): Float32Array {
    const n = Vec3.create();
    n[0] = v0[1] * v1[2] - v0[2] * v1[1];
    n[1] = v0[2] * v1[0] - v0[0] * v1[2];
    n[2] = v0[0] * v1[1] - v0[1] * v1[0];
    return n;
  }
  /**
   * 3 つのベクトルから面法線を求めて返す
   */
  static faceNormal(v0: Float32Array, v1: Float32Array, v2: Float32Array): Float32Array {
    const n = Vec3.create();
    const vec1 = [v1[0] - v0[0], v1[1] - v0[1], v1[2] - v0[2]];
    const vec2 = [v2[0] - v0[0], v2[1] - v0[1], v2[2] - v0[2]];
    n[0] = vec1[1] * vec2[2] - vec1[2] * vec2[1];
    n[1] = vec1[2] * vec2[0] - vec1[0] * vec2[2];
    n[2] = vec1[0] * vec2[1] - vec1[1] * vec2[0];
    return Vec3.normalize(n);
  }
}
