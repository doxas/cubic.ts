export class Mat4 {
  /**
   * 4x4 の正方行列を生成する
   */
  static create(): Float32Array {
    return new Float32Array(16);
  }
  /**
   * 行列を単位化する
   */
  static identity(reference?: Float32Array): Float32Array {
    const out = reference ?? Mat4.create();
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  /**
   * 行列を乗算する
   */
  static multiply(mat0: Float32Array, mat1: Float32Array, reference?: Float32Array): Float32Array {
    const out = reference ?? Mat4.create();
    const a = mat0[0],
      b = mat0[1],
      c = mat0[2],
      d = mat0[3],
      e = mat0[4],
      f = mat0[5],
      g = mat0[6],
      h = mat0[7],
      i = mat0[8],
      j = mat0[9],
      k = mat0[10],
      l = mat0[11],
      m = mat0[12],
      n = mat0[13],
      o = mat0[14],
      p = mat0[15],
      A = mat1[0],
      B = mat1[1],
      C = mat1[2],
      D = mat1[3],
      E = mat1[4],
      F = mat1[5],
      G = mat1[6],
      H = mat1[7],
      I = mat1[8],
      J = mat1[9],
      K = mat1[10],
      L = mat1[11],
      M = mat1[12],
      N = mat1[13],
      O = mat1[14],
      P = mat1[15];
    out[0] = A * a + B * e + C * i + D * m;
    out[1] = A * b + B * f + C * j + D * n;
    out[2] = A * c + B * g + C * k + D * o;
    out[3] = A * d + B * h + C * l + D * p;
    out[4] = E * a + F * e + G * i + H * m;
    out[5] = E * b + F * f + G * j + H * n;
    out[6] = E * c + F * g + G * k + H * o;
    out[7] = E * d + F * h + G * l + H * p;
    out[8] = I * a + J * e + K * i + L * m;
    out[9] = I * b + J * f + K * j + L * n;
    out[10] = I * c + J * g + K * k + L * o;
    out[11] = I * d + J * h + K * l + L * p;
    out[12] = M * a + N * e + O * i + P * m;
    out[13] = M * b + N * f + O * j + P * n;
    out[14] = M * c + N * g + O * k + P * o;
    out[15] = M * d + N * h + O * l + P * p;
    return out;
  }
  /**
   * 行列に拡大縮小を適用する
   */
  static scale(mat: Float32Array, vec: Float32Array, reference?: Float32Array): Float32Array {
    const out = reference ?? Mat4.create();
    out[0] = mat[0] * vec[0];
    out[1] = mat[1] * vec[0];
    out[2] = mat[2] * vec[0];
    out[3] = mat[3] * vec[0];
    out[4] = mat[4] * vec[1];
    out[5] = mat[5] * vec[1];
    out[6] = mat[6] * vec[1];
    out[7] = mat[7] * vec[1];
    out[8] = mat[8] * vec[2];
    out[9] = mat[9] * vec[2];
    out[10] = mat[10] * vec[2];
    out[11] = mat[11] * vec[2];
    out[12] = mat[12];
    out[13] = mat[13];
    out[14] = mat[14];
    out[15] = mat[15];
    return out;
  }
  /**
   * 行列に平行移動を適用する
   */
  static translate(mat: Float32Array, vec: Float32Array, reference?: Float32Array): Float32Array {
    const out = reference ?? Mat4.create();
    out[0] = mat[0];
    out[1] = mat[1];
    out[2] = mat[2];
    out[3] = mat[3];
    out[4] = mat[4];
    out[5] = mat[5];
    out[6] = mat[6];
    out[7] = mat[7];
    out[8] = mat[8];
    out[9] = mat[9];
    out[10] = mat[10];
    out[11] = mat[11];
    out[12] = mat[0] * vec[0] + mat[4] * vec[1] + mat[8] * vec[2] + mat[12];
    out[13] = mat[1] * vec[0] + mat[5] * vec[1] + mat[9] * vec[2] + mat[13];
    out[14] = mat[2] * vec[0] + mat[6] * vec[1] + mat[10] * vec[2] + mat[14];
    out[15] = mat[3] * vec[0] + mat[7] * vec[1] + mat[11] * vec[2] + mat[15];
    return out;
  }
  /**
   * 行列に回転を適用する
   */
  static rotate(mat: Float32Array, angle: number, axis: Float32Array, reference?: Float32Array): Float32Array {
    const out = reference ?? Mat4.create();
    let sq = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]);
    let a = axis[0],
      b = axis[1],
      c = axis[2];
    if (sq !== 1) {
      sq = 1 / sq;
      a *= sq;
      b *= sq;
      c *= sq;
    }
    const d = Math.sin(angle),
      e = Math.cos(angle),
      f = 1 - e,
      g = mat[0],
      h = mat[1],
      i = mat[2],
      j = mat[3],
      k = mat[4],
      l = mat[5],
      m = mat[6],
      n = mat[7],
      o = mat[8],
      p = mat[9],
      q = mat[10],
      r = mat[11],
      s = a * a * f + e,
      t = b * a * f + c * d,
      u = c * a * f - b * d,
      v = a * b * f - c * d,
      w = b * b * f + e,
      x = c * b * f + a * d,
      y = a * c * f + b * d,
      z = b * c * f - a * d,
      A = c * c * f + e;
    out[0] = g * s + k * t + o * u;
    out[1] = h * s + l * t + p * u;
    out[2] = i * s + m * t + q * u;
    out[3] = j * s + n * t + r * u;
    out[4] = g * v + k * w + o * x;
    out[5] = h * v + l * w + p * x;
    out[6] = i * v + m * w + q * x;
    out[7] = j * v + n * w + r * x;
    out[8] = g * y + k * z + o * A;
    out[9] = h * y + l * z + p * A;
    out[10] = i * y + m * z + q * A;
    out[11] = j * y + n * z + r * A;
    out[12] = mat[12];
    out[13] = mat[13];
    out[14] = mat[14];
    out[15] = mat[15];
    return out;
  }
  /**
   * ビュー座標変換行列を生成する
   */
  static lookAt(eye: Float32Array, center: Float32Array, up: Float32Array, reference?: Float32Array): Float32Array {
    const eyeX = eye[0],
      eyeY = eye[1],
      eyeZ = eye[2],
      upX = up[0],
      upY = up[1],
      upZ = up[2];
    const out = reference ?? Mat4.create();
    let x0, x1, x2, y0, y1, y2, z0, z1, z2, l;
    z0 = eyeX - center[0];
    z1 = eyeY - center[1];
    z2 = eyeZ - center[2];
    l = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= l;
    z1 *= l;
    z2 *= l;
    x0 = upY * z2 - upZ * z1;
    x1 = upZ * z0 - upX * z2;
    x2 = upX * z1 - upY * z0;
    l = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (l === 0) {
      x0 = 0;
      x1 = 0;
      x2 = 0;
    } else {
      l = 1 / l;
      x0 *= l;
      x1 *= l;
      x2 *= l;
    }
    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;
    l = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (l === 0) {
      y0 = 0;
      y1 = 0;
      y2 = 0;
    } else {
      l = 1 / l;
      y0 *= l;
      y1 *= l;
      y2 *= l;
    }
    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyeX + x1 * eyeY + x2 * eyeZ);
    out[13] = -(y0 * eyeX + y1 * eyeY + y2 * eyeZ);
    out[14] = -(z0 * eyeX + z1 * eyeY + z2 * eyeZ);
    out[15] = 1;
    return out;
  }
  /**
   * 透視投影変換行列を生成する
   */
  static perspective(fovy: number, aspect: number, near: number, far: number, reference?: Float32Array): Float32Array {
    const out = reference ?? Mat4.create();
    const t = near * Math.tan((fovy * Math.PI) / 360);
    const r = t * aspect;
    const a = r * 2,
      b = t * 2,
      c = far - near;
    out[0] = (near * 2) / a;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = (near * 2) / b;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = -(far + near) / c;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = -(far * near * 2) / c;
    out[15] = 0;
    return out;
  }
  /**
   * 正射影投影変換行列を生成する
   */
  static ortho(left: number, right: number, top: number, bottom: number, near: number, far: number, reference?: Float32Array): Float32Array {
    const out = reference ?? Mat4.create();
    const h = right - left;
    const v = top - bottom;
    const d = far - near;
    out[0] = 2 / h;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 2 / v;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = -2 / d;
    out[11] = 0;
    out[12] = -(left + right) / h;
    out[13] = -(top + bottom) / v;
    out[14] = -(far + near) / d;
    out[15] = 1;
    return out;
  }
  /**
   * 転置行列を生成する
   */
  static transpose(mat: Float32Array, reference?: Float32Array): Float32Array {
    const out = reference ?? Mat4.create();
    out[0] = mat[0];
    out[1] = mat[4];
    out[2] = mat[8];
    out[3] = mat[12];
    out[4] = mat[1];
    out[5] = mat[5];
    out[6] = mat[9];
    out[7] = mat[13];
    out[8] = mat[2];
    out[9] = mat[6];
    out[10] = mat[10];
    out[11] = mat[14];
    out[12] = mat[3];
    out[13] = mat[7];
    out[14] = mat[11];
    out[15] = mat[15];
    return out;
  }
  /**
   * 逆行列を生成する
   */
  static inverse(mat: Float32Array, reference?: Float32Array): Float32Array {
    const out = reference ?? Mat4.create();
    const a = mat[0],
      b = mat[1],
      c = mat[2],
      d = mat[3],
      e = mat[4],
      f = mat[5],
      g = mat[6],
      h = mat[7],
      i = mat[8],
      j = mat[9],
      k = mat[10],
      l = mat[11],
      m = mat[12],
      n = mat[13],
      o = mat[14],
      p = mat[15],
      q = a * f - b * e,
      r = a * g - c * e,
      s = a * h - d * e,
      t = b * g - c * f,
      u = b * h - d * f,
      v = c * h - d * g,
      w = i * n - j * m,
      x = i * o - k * m,
      y = i * p - l * m,
      z = j * o - k * n,
      A = j * p - l * n,
      B = k * p - l * o,
      ivd = 1 / (q * B - r * A + s * z + t * y - u * x + v * w);
    out[0] = (f * B - g * A + h * z) * ivd;
    out[1] = (-b * B + c * A - d * z) * ivd;
    out[2] = (n * v - o * u + p * t) * ivd;
    out[3] = (-j * v + k * u - l * t) * ivd;
    out[4] = (-e * B + g * y - h * x) * ivd;
    out[5] = (a * B - c * y + d * x) * ivd;
    out[6] = (-m * v + o * s - p * r) * ivd;
    out[7] = (i * v - k * s + l * r) * ivd;
    out[8] = (e * A - f * y + h * w) * ivd;
    out[9] = (-a * A + b * y - d * w) * ivd;
    out[10] = (m * u - n * s + p * q) * ivd;
    out[11] = (-i * u + j * s - l * q) * ivd;
    out[12] = (-e * z + f * x - g * w) * ivd;
    out[13] = (a * z - b * x + c * w) * ivd;
    out[14] = (-m * t + n * r - o * q) * ivd;
    out[15] = (i * t - j * r + k * q) * ivd;
    return out;
  }
  /**
   * ベクトルに行列を適用する
   */
  static toVecIV(vec: Float32Array, mat: Float32Array): Float32Array {
    const a = mat[0],
      b = mat[1],
      c = mat[2],
      d = mat[3],
      e = mat[4],
      f = mat[5],
      g = mat[6],
      h = mat[7],
      i = mat[8],
      j = mat[9],
      k = mat[10],
      l = mat[11],
      m = mat[12],
      n = mat[13],
      o = mat[14],
      p = mat[15],
      x = vec[0],
      y = vec[1],
      z = vec[2],
      w = vec[3];
    vec[0] = x * a + y * e + z * i + w * m;
    vec[1] = x * b + y * f + z * j + w * n;
    vec[2] = x * c + y * g + z * k + w * o;
    vec[3] = x * d + y * h + z * l + w * p;
    return vec;
  }
  /**
   * カメラのプロパティに相当する情報を受け取り行列を生成する
   */
  static vpFromCameraProperty(position: Float32Array, centerPoint: Float32Array, upDirection: Float32Array, fovy: number, aspect: number, near: number, far: number, vmat: Float32Array, pmat: Float32Array, reference: Float32Array) {
    Mat4.lookAt(position, centerPoint, upDirection, vmat);
    Mat4.perspective(fovy, aspect, near, far, pmat);
    Mat4.multiply(pmat, vmat, reference);
  }
  /**
   * MVP 行列に相当する行列を受け取りベクトルを変換して返す
   */
  static screenPositionFromMvp(mat: Float32Array, vec: Float32Array, width: number, height: number): number[] {
    const halfWidth = width * 0.5;
    const halfHeight = height * 0.5;
    const v = Mat4.toVecIV(new Float32Array([vec[0], vec[1], vec[2], 1.0]), mat);
    if (v[3] <= 0.0) {
      return [NaN, NaN];
    }
    v[0] /= v[3];
    v[1] /= v[3];
    v[2] /= v[3];
    return [halfWidth + v[0] * halfWidth, halfHeight - v[1] * halfHeight];
  }
}
