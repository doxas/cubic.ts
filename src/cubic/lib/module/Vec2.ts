export class Vec2 {
  /**
   * 2 つの要素を持つベクトルを生成する
   */
  static create(x: number = 0, y: number = 0): Float32Array {
    const v = new Float32Array(3);
    v[0] = x;
    v[1] = y;
    return v;
  }
  /**
   * ベクトルの長さ（大きさ）を返す
   */
  static len(v: Float32Array): number {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
  }
  /**
   * 2 つの座標（始点・終点）を結ぶベクトルを返す
   */
  static distance(v0: Float32Array, v1: Float32Array): Float32Array {
    const n = Vec2.create();
    n[0] = v1[0] - v0[0];
    n[1] = v1[1] - v0[1];
    return n;
  }
  /**
   * ベクトルを正規化した結果を返す
   */
  static normalize(v: Float32Array): Float32Array {
    const n = Vec2.create();
    const l = Vec2.len(v);
    if (l > 0) {
      const i = 1.0 / l;
      n[0] = v[0] * i;
      n[1] = v[1] * i;
    }
    return n;
  }
  /**
   * 2 つのベクトルの内積の結果を返す
   */
  static dot(v0: Float32Array, v1: Float32Array): number {
    return v0[0] * v1[0] + v0[1] * v1[1];
  }
  /**
   * 2 つのベクトルの外積の結果を返す
   */
  static cross(v0: Float32Array, v1: Float32Array): number {
    const n = Vec2.create();
    return v0[0] * v1[1] - v0[1] * v1[0];
  }
}
