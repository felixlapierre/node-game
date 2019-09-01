export class Input {
  left = false;
  right = false;
  up = false;
  down = false;
  angle = 0;
  click = false;
  selected = 0;

  mouse = {
    x: 0,
    y: 0
  };

  constructor() {
    document.addEventListener("keydown", this.onKeyDown.bind(this));

    document.addEventListener("keyup", this.onKeyUp.bind(this));

    document.addEventListener("mousedown", this.onMouseDown.bind(this));

    document.addEventListener("mouseup", this.onMouseUp.bind(this));

    document.addEventListener("mousemove", this.onMouseMove.bind(this), false);

    document.addEventListener("wheel", this.onWheel.bind(this));
  }

  onKeyDown(event) {
    this.setDirection(event.keyCode, true);
    if (event.keyCode >= 49 && event.keyCode <= 57) {
      this.selected = event.keyCode - 49;
    }
  }

  onKeyUp(event) {
    this.setDirection(event.keyCode, false);
  }

  setDirection(keyCode, value) {
    switch (keyCode) {
      case 65: //A
        this.left = value;
        break;
      case 87: //W
        this.up = value;
        break;
      case 68: //D
        this.right = value;
        break;
      case 83: //S
        this.down = value;
        break;
    }
  }

  onMouseDown(event) {
    this.click = true;
  }

  onMouseUp(event) {
    this.click = false;
  }

  onMouseMove(event) {
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;
  }

  onWheel(event) {
    this.selected = (this.selected + event.deltaY / 100) % 9;
    if (this.selected < 0) {
      this.selected += 9;
    }
  }

  getPlayerState() {
    return {
      up: this.up,
      down: this.down,
      left: this.left,
      right: this.right,
      angle: this.angle,
      click: this.click,
      selected: this.selected
    };
  }
}
