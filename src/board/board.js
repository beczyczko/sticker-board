import * as PIXI from 'pixi.js';

class Board {
    container;
    stickers = [];
    lastTimeClicked = 0;
    _onDoubleClick;

    constructor(stage, onDoubleClick) {
        this._onDoubleClick = onDoubleClick;

        const board = new PIXI.Graphics();
        board.beginFill(0x1099bb);
        board.drawRect(0, 0, 1000000, 1000000);
        board.endFill();

        board.interactive = true;

        board.on("mousedown", this.onClick());

        this.container = board;

        stage.addChild(board);
    }

    addSticker(sticker) {
        this.stickers.push(sticker);
        this.container.addChild(sticker);
    }

    onClick() {
        return e => {
            const clickTime = Date.now();

            if (clickTime - this.lastTimeClicked < 300) {
                this.lastTimeClicked = 0;
                const clickPosition = e.data.getLocalPosition(this.container.parent);

                this._onDoubleClick(clickPosition);
            } else {
                this.lastTimeClicked = clickTime;
            }
        };
    }
}

export default Board;
