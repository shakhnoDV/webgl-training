import { Injectable } from '@angular/core';
import { WebGL2Extended } from './gl.service';
@Injectable({
  providedIn: 'root'
})
export class ShaderService {
  vertexShader = `#version 300 es
  in vec3 a_position;
  uniform float uPointSize;
  void main(void){
    gl_PointSize = uPointSize + 100.0;
    gl_Position = vec4(a_position, 1.0);
  }`;
  fragmentShader = `#version 300 es
  precision mediump float;
  out vec4 finalColor;
  void main(void){
    finalColor = vec4(0.0, 0.9, 0.0, 1.0);
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


