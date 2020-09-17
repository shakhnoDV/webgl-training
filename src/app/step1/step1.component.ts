import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GlService } from '../gl.service';
import { ShaderService } from '../shader.service';
@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss']
})
export class Step1Component implements OnInit, AfterViewInit {
  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
  constructor(private gl: GlService, private shader: ShaderService) { }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    const gl = this.gl.GLInstance(this.canvas.nativeElement);
    gl.fSetSize(500, 500);
    gl.fClear();

    const vShader = ShaderService.createShader(gl, this.shader.vertexShader, gl.VERTEX_SHADER);
    const fShader = ShaderService.createShader(gl, this.shader.fragmentShader, gl.FRAGMENT_SHADER);
    const shaderProg = ShaderService.createProgram(gl, vShader, fShader, true);

    const aPositionLoc = gl.getAttribLocation(shaderProg, 'a_position');
    const uPointSizeLoc = gl.getUniformLocation(shaderProg, 'uPointSize');


    const aryVerts = new Float32Array([0, 0, 0, 0.5, 0.5, 0]);
    const bufVerts = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, bufVerts);
    gl.bufferData(gl.ARRAY_BUFFER, aryVerts, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.useProgram(shaderProg);
    gl.uniform1f(uPointSizeLoc, 70.0);
    gl.bindBuffer(gl.ARRAY_BUFFER, bufVerts);
    gl.enableVertexAttribArray(aPositionLoc);
    gl.vertexAttribPointer(aPositionLoc, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.drawArrays(gl.POINTS, 0, 2);
  }

}
