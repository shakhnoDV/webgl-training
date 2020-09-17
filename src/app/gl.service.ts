import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlService {
  constructor() { }
  GLInstance(canvas: HTMLCanvasElement): WebGL2Extended {
    const gl = canvas.getContext('webgl2') as WebGL2Extended;
    if (!gl) { console.error('WebGL context is not available.'); return null; }
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.fClear = function (): WebGL2Extended { this.clear(this.COLOR_BUFFER_BIT | this.DEPTH_BUFFER_BIT); return this; };
    gl.fSetSize = function (w, h): WebGL2Extended {
      this.canvas.style.width = w + 'px';
      this.canvas.style.height = h + 'px';
      this.canvas.width = w;
      this.canvas.height = h;
      this.viewport(0, 0, w, h);
      return this;
    };
    return gl;
  }
}
export interface WebGL2Extended extends WebGL2RenderingContext {
  fClear: () => WebGL2Extended;
  fSetSize: (w, h) => WebGL2Extended;
}
