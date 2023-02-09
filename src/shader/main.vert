attribute vec3 position;
attribute vec3 normal;
uniform mat4 mvpMatrix;
uniform mat4 normalMatrix;
varying vec4 vColor;

const vec3 light = vec3(1.0, 1.0, 1.0);

void main(){
  vec3 n = (normalMatrix * vec4(normal, 0.0)).xyz;
  float d = dot(normalize(n), normalize(light));
  vColor = vec4(vec3(d), 1.0);
  gl_Position = mvpMatrix * vec4(position, 1.0);
}

