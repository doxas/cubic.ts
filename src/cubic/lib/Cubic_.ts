import { Core } from './module/Core';
import { ShaderProgram } from './module/ShaderProgram';
import { Vec2 } from './module/Vec2';
import { Vec3 } from './module/Vec3';
import { Mat4 } from './module/Mat4';
import { Qtn } from './module/Qtn';
import { Geometry } from './module/Geometry';
import { Color } from './module/Color';

export default class GL3 {
  static get VERSION(): string {
    return '0.3';
  }
  static get Core() {
    return Core;
  }
  static get ShaderProgram() {
    return ShaderProgram;
  }
  static get Vec2() {
    return Vec2;
  }
  static get Vec3() {
    return Vec3;
  }
  static get Mat4() {
    return Mat4;
  }
  static get Qtn() {
    return Qtn;
  }
  static get Geometry() {
    return Geometry;
  }
  static get Color() {
    return Color;
  }
}
