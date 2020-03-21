import * as PIXI from 'pixi.js';
import Sticker from './Sticker';
import { BoardSignalRService } from '../signal-r/BoardSignalRService';
import { filter, switchMap, tap } from 'rxjs/operators';
import { StickerDto, StickersService } from '../services/services';
import { StickerColor } from './StickerColor';

class Board {
    container: PIXI.Graphics;
    stickers = Array<Sticker>();
    lastTimeClicked = 0;
    lastClickPosition: { x: number, y: number } = { x: 0, y: 0 };
    _onDoubleClick: (clickPosition: any) => void;

    constructor(
        stage: any,
        onDoubleClick: (clickPosition: any) => void,
        boardSignalRService: BoardSignalRService,
        stickersService: StickersService) {
        this._onDoubleClick = onDoubleClick;

        const board = new PIXI.Graphics();
        board.beginFill(0xf1f1f1);
        board.drawRect(-10000, -5000, 20000, 10000);
        board.endFill();

        board.interactive = true;
        this.registerMouseEventHandlers(board);

        this.container = board;

        stage.addChild(board);

        this.subscribeSignalREvents(boardSignalRService, stickersService);
    }

    public addSticker(sticker: Sticker) {
        if (!this.stickers.some(s => s.id === sticker.id)) {
            this.stickers.push(sticker);
            this.container.addChild(sticker.element);
        }
    }

    private subscribeSignalREvents(boardSignalRService: BoardSignalRService, stickersService: StickersService) {
        boardSignalRService.stickerMoved()
            .pipe(tap(e => {
                const sticker = this.stickers.find(s => s.id === e.stickerId);
                if (sticker) {
                    sticker.move(e.position);
                }
            }))
            .subscribe();
        boardSignalRService.stickerCreated()
            .pipe(
                filter(e => {
                    return !this.stickers.find(s => s.id === e.stickerId);
                }),
                switchMap(e => stickersService.stickers2(e.stickerId)),
                tap((s: StickerDto) => {
                    if (s.position && s.text && s.color) {
                        const newSticker = new Sticker(
                            s.id,
                            s.position.x,
                            s.position.y,
                            s.text,
                            StickerColor.create(s.color));
                        this.addSticker(newSticker);
                    }
                }))
            .subscribe();
    }

    private registerMouseEventHandlers(board: PIXI.Graphics) {
        board.on('mousedown', e => this.onClick(e))
    }

    private onClick(event) {
        const clickTime = Date.now();
        this.lastClickPosition = event.data.getLocalPosition(this.container);

        if (clickTime - this.lastTimeClicked < 300) {
            this.lastTimeClicked = 0;
            this._onDoubleClick(this.lastClickPosition);
        } else {
            this.lastTimeClicked = clickTime;
        }
    }
}

export default Board;
