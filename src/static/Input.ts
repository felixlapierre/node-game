
export class Input {
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
    angle: number;
    click: boolean;
    selected: number;

    mouse: {
        x: number;
        y: number;
    }

    constructor() {
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;
        this.angle = 0;
        this.click = false;
        this.mouse = {
            x: 0,
            y: 0
        }
        this.selected = 0;

        document.addEventListener('keydown', (event) => {
            switch (event.keyCode) {
                case 65: //A
                    this.left = true;
                    break;
                case 87: //W
                    this.up = true;
                    break;
                case 68: //D
                    this.right = true;
                    break;
                case 83: //S
                    this.down = true;
                    break;
            }
            if (event.keyCode >= 49 && event.keyCode <= 57) {
                this.selected = event.keyCode - 49;
            }
        });
        
        document.addEventListener('keyup', (event) => {
            switch (event.keyCode) {
                case 65: //A
                    this.left = false;
                    break;
                case 87: //W
                    this.up = false;
                    break;
                case 68: //D
                    this.right = false;
                    break;
                case 83: //S
                    this.down = false;
                    break;
            }
        });
        
        document.addEventListener('mousedown', (event) => {
            this.click = true;
        });
        
        document.addEventListener('mouseup', (event) => {
            this.click = false;
        });
        
        document.addEventListener('mousemove', (event) => {
            this.mouse.x = event.clientX;
            this.mouse.y = event.clientY;
        }, false);
        
        document.addEventListener('wheel', (event) => {
            this.selected = (this.selected + (event.deltaY / 100)) % 9;
            if (this.selected < 0) {
                this.selected += 9;
            }
        });
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
        }
    }
}
