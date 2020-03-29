import Sticker, { Position } from './Sticker';
import { BoardSignalRService } from '../signal-r/BoardSignalRService';
import { filter, switchMap, tap } from 'rxjs/operators';
import { StickerDto, StickersService } from '../services/services';
import { StickerColor } from './StickerColor';

class Board {
    stickers = Array<Sticker>();
    lastTimeClicked = 0;
    lastClickPosition: Position = { x: 0, y: 0 };

    private readonly stickersService: StickersService;
    private readonly onDoubleClick: (clickPosition: any) => void;
    scale: number = 1;
    private position: Position = { x: 0, y: 0 };

    constructor(
        onDoubleClick: (clickPosition: any) => void,
        boardSignalRService: BoardSignalRService,
        stickersService: StickersService,
        windowWidth: number,
        windowHeight: number) {
        this.stickersService = stickersService;
        this.onDoubleClick = onDoubleClick;

        // this.registerMouseEventHandlers(board);
        this.loadStickers();
        this.subscribeSignalREvents(boardSignalRService, stickersService);
    }

    public addSticker(sticker: Sticker): void {
        if (!this.stickers.some(s => s.id === sticker.id)) {
            this.stickers.push(sticker);
            sticker.showTextField();
        }
    }

    public setScale(newScale: number): void {
        this.scale = newScale;

        this.updateBoardHtmlLayer();
    }

    public move(positionChange: { dx: number, dy: number }): void {
        const boardPosition = this.position;

        this.position = {
            x: boardPosition.x + positionChange.dx,
            y: boardPosition.y + positionChange.dy
        };

        this.updateBoardHtmlLayer();
    }

    public moveToPosition(position: { x: number, y: number }): void {
        this.updateBoardHtmlLayer();
    }

    private updateBoardHtmlLayer() {
        const htmlLayer = document.getElementById('board-html-layer');
        if (htmlLayer) {
            htmlLayer.style.transform = `scale(${this.scale})`;
            htmlLayer.style.transformOrigin = '0 0';
            htmlLayer.style.top = `${this.position.y}px`;
            htmlLayer.style.left = `${this.position.x}px`;
        }
    }

    private loadStickers(): void {
        this.stickersService.stickers()
            .then(stickers => {
                stickers.forEach(s => {
                    if (s.position && s.text && s.color)
                        this.addSticker(new Sticker(
                            s.id,
                            s.position.x,
                            s.position.y,
                            s.text,
                            StickerColor.create(s.color)));
                });
            });
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
                switchMap(e => stickersService.sticker(e.stickerId)),
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

    // private registerMouseEventHandlers(board: PIXI.Graphics) {
    //     board.on('mousedown', e => this.onClick(e))
    // }

    private onClick(event) {
        const clickTime = Date.now();
        //todo db
        // this.lastClickPosition = event.data.getLocalPosition(this.container);

        if (clickTime - this.lastTimeClicked < 300) {
            this.lastTimeClicked = 0;
            this.onDoubleClick(this.lastClickPosition);
        } else {
            this.lastTimeClicked = clickTime;
        }
    }
}

export default Board;
