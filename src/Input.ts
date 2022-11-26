type InputSignal = () => void;
type InputListener = (event: KeyboardEvent) => void;

class Input {
  private readonly key: string;
  private downListener: InputListener;
  private upListener: InputListener;

  private _downSignal: InputSignal | undefined;
  private _upSignal: InputSignal | undefined;
  constructor(key: string) {
    this.key = key;

    this.downListener = this.onKeyDown.bind(this);
    this.upListener = this.onKeyUp.bind(this);
    window.addEventListener('keydown', this.downListener);
    window.addEventListener('keyup', this.upListener);
  }

  set both(signal: InputSignal) {
    this._downSignal = signal;
    this._upSignal = signal;
  }

  set down(signal: InputSignal) {
    this._downSignal = signal;
  }

  set up(signal: InputSignal) {
    this._upSignal = signal;
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (this._downSignal && event.key === this.key) {
      this._downSignal();
    }
  }

  private onKeyUp(event: KeyboardEvent): void {
    if (this._upSignal && event.key === this.key) {
      this._upSignal();
    }
  }

  private remove(): void {
    window.removeEventListener('keydown', this.downListener);
    window.removeEventListener('keyup', this.upListener);
  }
}

export { Input };
