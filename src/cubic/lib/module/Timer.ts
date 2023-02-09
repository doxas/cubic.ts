export class Timer {
  private initial: number;
  private previous: number;

  constructor() {
    this.initial = Date.now();
    this.previous = this.initial;
  }
  passMS(): number {
    this.previous = Date.now();
    const diff = this.previous - this.initial;
    return diff;
  }
  pass(): number {
    return this.passMS() * 0.001;
  }
  deltaMS(): number {
    const now = Date.now();
    const diff = now - this.previous;
    this.previous = now;
    return diff;
  }
  delta(): number {
    return this.passMS() * 0.001;
  }
}
