import * as PIXI from 'pixi.js';
import Sticker from './sticker';

class Board {
    container: any;
    stickers = Array<Sticker>();
    lastTimeClicked = 0;
    _onDoubleClick: (clickPosition: any) => void;

    constructor(stage: any, onDoubleClick: (clickPosition: any) => void) {
        this._onDoubleClick = onDoubleClick;

        const board = new PIXI.Graphics();
        board.beginFill(0xf1f1f1);
        board.drawRect(0, 0, 1000000, 1000000);
        board.endFill();

        board.interactive = true;

        board.on('mousedown', this.onClick());

        this.container = board;

        stage.addChild(board);
    }

    addSticker(sticker: Sticker) {
        this.stickers.push(sticker);
        this.container.addChild(sticker.element);
    }

    onClick() {
        return (e: any) => {
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
