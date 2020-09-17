export class RenderLoopService {
  msLastFrame: number;
  callBack: any;
  isActive: boolean;
  fps: number;
  msFpsLimit: number;
  run: any;
  constructor(callback: any, fps?: number) {
    this.msLastFrame = null;
    this.callBack = callback;
    this.isActive = false;
    this.fps = 0;

    if (!fps && fps > 0) {
      this.msFpsLimit = 1000 / fps;
      this.run = () => {
        const msCurrent = performance.now();
        const msDelta = (msCurrent - this.msLastFrame);
        const deltaTime = msDelta / 1000.0;
        if (msDelta >= this.msFpsLimit) {
          this.fps = Math.floor(1 / deltaTime);
          this.msLastFrame = msCurrent;
          this.callBack(deltaTime);
        }
        if (this.isActive) {
          window.requestAnimationFrame(this.run);
        }
      };
    } else {
      this.run = () => {

        const msCurrent = performance.now();
        const deltaTime = (msCurrent - this.msLastFrame) / 1000.0;
        this.fps = Math.floor(1 / deltaTime);
        this.msLastFrame = msCurrent;

        this.callBack(deltaTime);
        if (this.isActive) {
          window.requestAnimationFrame(this.run);
        }
      };
    }
  }
  start(): RenderLoopService {
    this.isActive = true;
    this.msLastFrame = performance.now();
    window.requestAnimationFrame(this.run);
    return this;
  }
  stop(): void {
    this.isActive = false;
  }
}
