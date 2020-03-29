import Sticker from './Sticker';
import { BoardSignalRService } from '../signal-r/BoardSignalRService';
import { filter, switchMap, tap } from 'rxjs/operators';
import { StickerDto, StickersService } from '../services/services';
import { StickerColor } from './StickerColor';
import { Position } from './Position';
import { Observable, Subject } from 'rxjs';
import { MouseButton } from './MouseButton';
import { subscribeToScrollEvents } from './BoardNavigation';

class Board {

    private readonly stickersService: StickersService;
    private readonly onDoubleClick: (clickPosition: any) => void;
    private _middleButtonClicked$ = new Subject<void>();

    public position: Position = { x: 0, y: 0 };
    public scale: number = 1;

    public stickers = Array<Sticker>();

    public readonly boardHtmlLayer: HTMLElement | null;
    public readonly boardHtmlElementsLayer: HTMLElement | null;

    constructor(
        onDoubleClick: (clickPosition: any) => void,
        boardSignalRService: BoardSignalRService,
        stickersService: StickersService,
        windowWidth: number,
        windowHeight: number) {
        this.boardHtmlElementsLayer = document.getElementById('board-html-elements-layer');
        this.boardHtmlLayer = document.getElementById('board-html-layer');

        this.stickersService = stickersService;
        this.onDoubleClick = onDoubleClick;

        this.registerMouseEventHandlers();

        this.loadStickers();
        this.subscribeSignalREvents(boardSignalRService, stickersService);
        subscribeToScrollEvents(this);
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

    public moveToPosition(position: Position): void {
        this.position = position;
        this.updateBoardHtmlLayer();
    }

    public get middleButtonClicked$(): Observable<void> {
        return this._middleButtonClicked$.asObservable();
    }

    private updateBoardHtmlLayer() {
        const htmlLayer = document.getElementById('board-html-elements-layer');
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

    private registerMouseEventHandlers(): void {
        this.boardHtmlLayer?.addEventListener('mousedown', (e: MouseEvent) => this.onClick(e));
        this.boardHtmlLayer?.addEventListener('touchstart', (e: any) => this.onClick(e));
        this._middleButtonClicked$.next();
    }

    private onClick(event: MouseEvent): void {
        event.stopPropagation();

        if (event.button === MouseButton.middle) {
            this._middleButtonClicked$.next();
        }
    }
}

export default Board;
