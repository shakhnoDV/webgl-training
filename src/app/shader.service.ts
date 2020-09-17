import { Injectable } from '@angular/core';
import { WebGL2Extended } from './gl.service';
@Injectable({
  providedIn: 'root'
})
export class ShaderService {
  vertexShader = `#version 300 es
  in vec3 a_position;
  uniform float uPointSize;
  uniform float uAngle;
  void main(void){
    gl_PointSize = uPointSize;
    gl_Position = vec4(
      cos(uAngle) * 0.8 + a_position.x,
      sin(uAngle) * 0.8 + a_position.y,
      a_position.z, 1.0 );
  }`;
  fragmentShader = `#version 300 es
  precision mediump float;
  uniform float uAngle2;
  out vec4 finalColor;
  void main(void){
    finalColor = vec4((cos(uAngle2) + 1.0)* 0.5, (sin(uAngle2) + 1.0)* 0.5, 0.0, 1.0);
  }`;
  constructor() { }
  static createShader(gl: WebGL2Extended, src: string, type: number): WebGLShader {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Error compiling shader : ' + src, gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }
  static createProgram(gl: WebGL2Extended, vShader: WebGLShader, fShader: WebGLShader, doValidate: boolean): WebGLProgram {

    const prog = gl.createProgram();
    gl.attachShader(prog, vShader);
    gl.attachShader(prog, fShader);
    gl.linkProgram(prog);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('Error creating shader program.', gl.getProgramInfoLog(prog));
      gl.deleteProgram(prog); return null;
    }

    if (doValidate) {
      gl.validateProgram(prog);
      if (!gl.getProgramParameter(prog, gl.VALIDATE_STATUS)) {
        console.error('Error validating program', gl.getProgramInfoLog(prog));
        gl.deleteProgram(prog); return null;
      }
    }
    gl.detachShader(prog, vShader);
    gl.detachShader(prog, fShader);
    gl.deleteShader(fShader);
    gl.deleteShader(vShader);
    return prog;
  }
}


