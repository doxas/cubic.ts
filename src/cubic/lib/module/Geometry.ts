import { Color } from './Color';
import { iGeometryAttribute } from '../static/interface';

export class Geometry {
  /**
   * 板ポリゴンの頂点情報を生成する
   * @example
   * const planeData = GL3.Geometry.plane(2.0, 2.0, [1.0, 1.0, 1.0, 1.0]);
   */
  static plane(width: number, height: number, color?: Color): iGeometryAttribute {
    const tc = color ?? new Color(1.0, 1.0, 1.0, 1.0);
    const w = width / 2;
    const h = height / 2;
    const pos = [];
    pos.push(-w, h, 0.0);
    pos.push(w, h, 0.0);
    pos.push(-w, -h, 0.0);
    pos.push(w, -h, 0.0);
    const nor = [];
    nor.push(0.0, 0.0, 1.0);
    nor.push(0.0, 0.0, 1.0);
    nor.push(0.0, 0.0, 1.0);
    nor.push(0.0, 0.0, 1.0);
    const col = [];
    col.push(tc.r, tc.g, tc.b, tc.a);
    col.push(tc.r, tc.g, tc.b, tc.a);
    col.push(tc.r, tc.g, tc.b, tc.a);
    col.push(tc.r, tc.g, tc.b, tc.a);
    const st = [];
    st.push(0.0, 0.0);
    st.push(1.0, 0.0);
    st.push(0.0, 1.0);
    st.push(1.0, 1.0);
    const idx = [];
    idx.push(0, 1, 2);
    idx.push(2, 1, 3);
    return { position: pos, normal: nor, color: col, texCoord: st, index: idx };
  }

  /**
   * 円（XY 平面展開）の頂点情報を生成する
   * @example
   * const circleData = GL3.Geometry.circle(64, 1.0, [1.0, 1.0, 1.0, 1.0]);
   */
  static circle(split: number, rad: number, color?: Color): iGeometryAttribute {
    const tc = color ?? new Color(1.0, 1.0, 1.0, 1.0);
    const pos = [],
      nor = [],
      col = [],
      st = [],
      idx = [];
    pos.push(0.0, 0.0, 0.0);
    nor.push(0.0, 0.0, 1.0);
    col.push(tc.r, tc.g, tc.b, tc.a);
    st.push(0.5, 0.5);
    for (let i = 0, j = 0; i < split; ++i) {
      const r = ((Math.PI * 2.0) / split) * i;
      const rx = Math.cos(r);
      const ry = Math.sin(r);
      pos.push(rx * rad, ry * rad, 0.0);
      nor.push(0.0, 0.0, 1.0);
      col.push(tc.r, tc.g, tc.b, tc.a);
      st.push((rx + 1.0) * 0.5, 1.0 - (ry + 1.0) * 0.5);
      if (i === split - 1) {
        idx.push(0, j + 1, 1);
      } else {
        idx.push(0, j + 1, j + 2);
      }
      ++j;
    }
    return { position: pos, normal: nor, color: col, texCoord: st, index: idx };
  }

  /**
   * キューブの頂点情報を生成する
   * @example
   * const cubeData = GL3.Geometry.cube(2.0, [1.0, 1.0, 1.0, 1.0]);
   */
  static cube(side: number, color?: Color): iGeometryAttribute {
    const tc = color ?? new Color(1.0, 1.0, 1.0, 1.0);
    const hs = side * 0.5;
    const pos = [];
    pos.push(-hs, -hs, hs, hs, -hs, hs, hs, hs, hs, -hs, hs, hs);
    pos.push(-hs, -hs, -hs, -hs, hs, -hs, hs, hs, -hs, hs, -hs, -hs);
    pos.push(-hs, hs, -hs, -hs, hs, hs, hs, hs, hs, hs, hs, -hs);
    pos.push(-hs, -hs, -hs, hs, -hs, -hs, hs, -hs, hs, -hs, -hs, hs);
    pos.push(hs, -hs, -hs, hs, hs, -hs, hs, hs, hs, hs, -hs, hs);
    pos.push(-hs, -hs, -hs, -hs, -hs, hs, -hs, hs, hs, -hs, hs, -hs);
    const v = 1.0 / Math.sqrt(3.0);
    const nor = [];
    nor.push(-v, -v, v, v, -v, v, v, v, v, -v, v, v);
    nor.push(-v, -v, -v, -v, v, -v, v, v, -v, v, -v, -v);
    nor.push(-v, v, -v, -v, v, v, v, v, v, v, v, -v);
    nor.push(-v, -v, -v, v, -v, -v, v, -v, v, -v, -v, v);
    nor.push(v, -v, -v, v, v, -v, v, v, v, v, -v, v);
    nor.push(-v, -v, -v, -v, -v, v, -v, v, v, -v, v, -v);
    const col = [];
    for (let i = 0; i < pos.length / 3; ++i) {
      col.push(tc.r, tc.g, tc.b, tc.a);
    }
    const st = [];
    st.push(0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0);
    st.push(0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0);
    st.push(0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0);
    st.push(0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0);
    st.push(0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0);
    st.push(0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0);
    const idx = [];
    idx.push(0, 1, 2, 0, 2, 3);
    idx.push(4, 5, 6, 4, 6, 7);
    idx.push(8, 9, 10, 8, 10, 11);
    idx.push(12, 13, 14, 12, 14, 15);
    idx.push(16, 17, 18, 16, 18, 19);
    idx.push(20, 21, 22, 20, 22, 23);
    return { position: pos, normal: nor, color: col, texCoord: st, index: idx };
  }

  /**
   * 三角錐の頂点情報を生成する
   * @example
   * const coneData = GL3.Geometry.cone(64, 1.0, 2.0, [1.0, 1.0, 1.0, 1.0]);
   */
  static cone(split: number, rad: number, height: number, color?: Color): iGeometryAttribute {
    const tc = color ?? new Color(1.0, 1.0, 1.0, 1.0);
    const h = height / 2.0;
    const pos = [],
      nor = [],
      col = [],
      st = [],
      idx = [];
    pos.push(0.0, -h, 0.0);
    nor.push(0.0, -1.0, 0.0);
    col.push(tc.r, tc.g, tc.b, tc.a);
    st.push(0.5, 0.5);
    for (let i = 0, j = 0; i <= split; ++i) {
      const r = ((Math.PI * 2.0) / split) * i;
      const rx = Math.cos(r);
      const rz = Math.sin(r);
      pos.push(rx * rad, -h, rz * rad);
      pos.push(rx * rad, -h, rz * rad);
      nor.push(0.0, -1.0, 0.0);
      nor.push(rx, 0.0, rz);
      col.push(tc.r, tc.g, tc.b, tc.a);
      col.push(tc.r, tc.g, tc.b, tc.a);
      st.push((rx + 1.0) * 0.5, 1.0 - (rz + 1.0) * 0.5);
      st.push((rx + 1.0) * 0.5, 1.0 - (rz + 1.0) * 0.5);
      if (i !== split) {
        idx.push(0, j + 1, j + 3);
        idx.push(j + 4, j + 2, split * 2 + 3);
      }
      j += 2;
    }
    pos.push(0.0, h, 0.0);
    nor.push(0.0, 1.0, 0.0);
    col.push(tc.r, tc.g, tc.b, tc.a);
    st.push(0.5, 0.5);
    return { position: pos, normal: nor, color: col, texCoord: st, index: idx };
  }

  /**
   * 円柱の頂点情報を生成する
   * @example
   * const cylinderData = GL3.Geometry.cylinder(64, 0.5, 1.0, 2.0, [1.0, 1.0, 1.0, 1.0]);
   */
  static cylinder(split: number, topRad: number, bottomRad: number, height: number, color?: Color): iGeometryAttribute {
    const tc = color ?? new Color(1.0, 1.0, 1.0, 1.0);
    const h = height / 2.0;
    const pos = [],
      nor = [],
      col = [],
      st = [],
      idx = [];
    pos.push(0.0, h, 0.0, 0.0, -h, 0.0);
    nor.push(0.0, 1.0, 0.0, 0.0, -1.0, 0.0);
    col.push(tc.r, tc.g, tc.b, tc.a, tc.r, tc.g, tc.b, tc.a);
    st.push(0.5, 0.5, 0.5, 0.5);
    for (let i = 0, j = 2; i <= split; ++i) {
      const r = ((Math.PI * 2.0) / split) * i;
      const rx = Math.cos(r);
      const rz = Math.sin(r);
      pos.push(rx * topRad, h, rz * topRad);
      pos.push(rx * topRad, h, rz * topRad);
      pos.push(rx * bottomRad, -h, rz * bottomRad);
      pos.push(rx * bottomRad, -h, rz * bottomRad);
      nor.push(0.0, 1.0, 0.0);
      nor.push(rx, 0.0, rz);
      nor.push(0.0, -1.0, 0.0);
      nor.push(rx, 0.0, rz);
      col.push(tc.r, tc.g, tc.b, tc.a);
      col.push(tc.r, tc.g, tc.b, tc.a);
      col.push(tc.r, tc.g, tc.b, tc.a);
      col.push(tc.r, tc.g, tc.b, tc.a);
      st.push((rx + 1.0) * 0.5, 1.0 - (rz + 1.0) * 0.5);
      st.push(1.0 - i / split, 0.0);
      st.push((rx + 1.0) * 0.5, 1.0 - (rz + 1.0) * 0.5);
      st.push(1.0 - i / split, 1.0);
      if (i !== split) {
        idx.push(0, j + 4, j);
        idx.push(1, j + 2, j + 6);
        idx.push(j + 5, j + 7, j + 1);
        idx.push(j + 1, j + 7, j + 3);
      }
      j += 4;
    }
    return { position: pos, normal: nor, color: col, texCoord: st, index: idx };
  }

  /**
   * 球体の頂点情報を生成する
   * @example
   * const sphereData = GL3.Geometry.sphere(64, 64, 1.0, [1.0, 1.0, 1.0, 1.0]);
   */
  static sphere(row: number, column: number, rad: number, color?: Color): iGeometryAttribute {
    const tc = color ?? new Color(1.0, 1.0, 1.0, 1.0);
    const pos = [],
      nor = [],
      col = [],
      st = [],
      idx = [];
    for (let i = 0; i <= row; ++i) {
      const r = (Math.PI / row) * i;
      const ry = Math.cos(r);
      const rr = Math.sin(r);
      for (let j = 0; j <= column; ++j) {
        const tr = ((Math.PI * 2) / column) * j;
        const tx = rr * rad * Math.cos(tr);
        const ty = ry * rad;
        const tz = rr * rad * Math.sin(tr);
        const rx = rr * Math.cos(tr);
        const rz = rr * Math.sin(tr);
        pos.push(tx, ty, tz);
        nor.push(rx, ry, rz);
        col.push(tc.r, tc.g, tc.b, tc.a);
        st.push(1 - (1 / column) * j, (1 / row) * i);
      }
    }
    for (let i = 0; i < row; ++i) {
      for (let j = 0; j < column; ++j) {
        const r = (column + 1) * i + j;
        idx.push(r, r + 1, r + column + 2);
        idx.push(r, r + column + 2, r + column + 1);
      }
    }
    return { position: pos, normal: nor, color: col, texCoord: st, index: idx };
  }

  /**
   * トーラスの頂点情報を生成する
   * @example
   * const torusData = GL3.Geometry.torus(64, 64, 0.25, 0.75, [1.0, 1.0, 1.0, 1.0]);
   */
  static torus(row: number, column: number, irad: number, orad: number, color?: Color): iGeometryAttribute {
    const tc = color ?? new Color(1.0, 1.0, 1.0, 1.0);
    const pos = [],
      nor = [],
      col = [],
      st = [],
      idx = [];
    for (let i = 0; i <= row; ++i) {
      const r = ((Math.PI * 2) / row) * i;
      const rr = Math.cos(r);
      const ry = Math.sin(r);
      for (let j = 0; j <= column; ++j) {
        const tr = ((Math.PI * 2) / column) * j;
        const tx = (rr * irad + orad) * Math.cos(tr);
        const ty = ry * irad;
        const tz = (rr * irad + orad) * Math.sin(tr);
        const rx = rr * Math.cos(tr);
        const rz = rr * Math.sin(tr);
        const rs = (1 / column) * j;
        let rt = (1 / row) * i + 0.5;
        if (rt > 1.0) {
          rt -= 1.0;
        }
        rt = 1.0 - rt;
        pos.push(tx, ty, tz);
        nor.push(rx, ry, rz);
        col.push(tc.r, tc.g, tc.b, tc.a);
        st.push(rs, rt);
      }
    }
    for (let i = 0; i < row; ++i) {
      for (let j = 0; j < column; ++j) {
        const r = (column + 1) * i + j;
        idx.push(r, r + column + 1, r + 1);
        idx.push(r + column + 1, r + column + 2, r + 1);
      }
    }
    return { position: pos, normal: nor, color: col, texCoord: st, index: idx };
  }

  /**
   * 正二十面体の頂点情報を生成する
   * @example
   * const icosaData = GL3.Geometry.icosahedron(1.0, [1.0, 1.0, 1.0, 1.0]);
   */
  static icosahedron(rad: number, color?: Color): iGeometryAttribute {
    const tc = color ?? new Color(1.0, 1.0, 1.0, 1.0);
    const c = (1.0 + Math.sqrt(5.0)) / 2.0;
    const t = c * rad;
    const l = Math.sqrt(1.0 + c * c);
    const r = [1.0 / l, c / l];
    const pos = [];
    pos.push(-rad, t, 0.0, rad, t, 0.0, -rad, -t, 0.0, rad, -t, 0.0);
    pos.push(0.0, -rad, t, 0.0, rad, t, 0.0, -rad, -t, 0.0, rad, -t);
    pos.push(t, 0.0, -rad, t, 0.0, rad, -t, 0.0, -rad, -t, 0.0, rad);
    const nor = [];
    nor.push(-r[0], r[1], 0.0, r[0], r[1], 0.0, -r[0], -r[1], 0.0, r[0], -r[1], 0.0);
    nor.push(0.0, -r[0], r[1], 0.0, r[0], r[1], 0.0, -r[0], -r[1], 0.0, r[0], -r[1]);
    nor.push(r[1], 0.0, -r[0], r[1], 0.0, r[0], -r[1], 0.0, -r[0], -r[1], 0.0, r[0]);
    const col = [];
    col.push(tc.r, tc.g, tc.b, tc.a, tc.r, tc.g, tc.b, tc.a);
    col.push(tc.r, tc.g, tc.b, tc.a, tc.r, tc.g, tc.b, tc.a);
    col.push(tc.r, tc.g, tc.b, tc.a, tc.r, tc.g, tc.b, tc.a);
    col.push(tc.r, tc.g, tc.b, tc.a, tc.r, tc.g, tc.b, tc.a);
    col.push(tc.r, tc.g, tc.b, tc.a, tc.r, tc.g, tc.b, tc.a);
    col.push(tc.r, tc.g, tc.b, tc.a, tc.r, tc.g, tc.b, tc.a);
    const st = [];
    for (let i = 0, j = nor.length; i < j; i += 3) {
      const u = (Math.atan2(nor[i + 2], -nor[i]) + Math.PI) / (Math.PI * 2.0);
      const v = 1.0 - (nor[i + 1] + 1.0) / 2.0;
      st.push(u, v);
    }
    const idx = [];
    idx.push(0, 11, 5, 0, 5, 1, 0, 1, 7, 0, 7, 10, 0, 10, 11);
    idx.push(1, 5, 9, 5, 11, 4, 11, 10, 2, 10, 7, 6, 7, 1, 8);
    idx.push(3, 9, 4, 3, 4, 2, 3, 2, 6, 3, 6, 8, 3, 8, 9);
    idx.push(4, 9, 5, 2, 4, 11, 6, 2, 10, 8, 6, 7, 9, 8, 1);
    return { position: pos, normal: nor, color: col, texCoord: st, index: idx };
  }
}
