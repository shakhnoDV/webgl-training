import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GlService } from '../gl.service';
import { ShaderService } from '../shader.service';
import { RenderLoopService } from '../render-loop.service';
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
    const uAngle = gl.getUniformLocation(shaderProg, 'uAngle');
    const uAngle2 = gl.getUniformLocation(shaderProg, 'uAngle2');
    const uPointSizeLoc = gl.getUniformLocation(shaderProg, 'uPointSize');
    gl.useProgram(shaderProg);

    const aryVerts = new Float32Array([0, 0, 0]);
    const bufVerts = gl.createBuffer();
    const gVertCnt = aryVerts.length / 3;
    gl.bindBuffer(gl.ARRAY_BUFFER, bufVerts);
    gl.enableVertexAttribArray(aPositionLoc);
    gl.vertexAttribPointer(aPositionLoc, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    let gPointSize = 0;
    const gPSizeStep = 3;
    let gAngle = 0;
    const gAngleStep = (Math.PI / 180.0) * 90;
    const onRender = (dt) => {
      gPointSize += gPSizeStep * dt;
      const size = (Math.sin(gPointSize) * 10.0) + 30.0;
      gl.uniform1f(uPointSizeLoc, size);
      gAngle += gAngleStep * dt;
      gl.uniform1f(uAngle, gAngle);
      gl.uniform1f(uAngle2, gAngle);
      gl.fClear();
      gl.drawArrays(gl.POINTS, 0, gVertCnt);
    };
    const RLoop = new RenderLoopService(onRender, 1).start();
  }

}
