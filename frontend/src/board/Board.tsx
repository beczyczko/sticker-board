import Sticker from './Sticker';
import { BoardSignalRService } from '../signal-r/BoardSignalRService';
import { concatMap, filter, tap } from 'rxjs/operators';
import { StickerDto, StickersService } from '../services/services';
import { StickerColor } from './StickerColor';
import { Position } from './Position';
import { Observable, Subject } from 'rxjs';
import { MouseButton } from './MouseButton';
import { subscribeToScrollEvents } from './BoardNavigation';
import { SelectionService } from '../services/SelectionService';
import { ViewChangedService } from '../services/ViewChangedService';

class Board {
    private readonly selectionService: SelectionService | undefined;
    private readonly stickersService: StickersService;
    private readonly viewChangedService: ViewChangedService;
    private _middleButtonClicked$ = new Subject<void>();
    private _doubleClicked$ = new Subject<Position>();
    private stickerToLoad$ = new Subject<StickerId>();

    public position: Position = { x: 0, y: 0 };
    public scale: number = 1;

    public stickers = Array<Sticker>();

    public readonly boardHtmlLayer: HTMLElement | null;
    public readonly boardHtmlElementsLayer: HTMLElement | null;

    constructor(
        boardSignalRService: BoardSignalRService,
        stickersService: StickersService,
        windowWidth: number,
        windowHeight: number) {
        this.boardHtmlElementsLayer = document.getElementById('board-html-elements-layer');
        this.boardHtmlLayer = document.getElementById('board-html-layer');

        this.viewChangedService = new ViewChangedService();
        if (this.boardHtmlLayer) {
            this.selectionService = SelectionService.initialize(this.boardHtmlLayer, this.viewChangedService);
        }

        this.moveToPosition({ x: windowWidth / 2, y: windowHeight / 2 });

        this.stickersService = stickersService;

        this.registerMouseEventHandlers();

        this.loadStickers();
        this.subscribeSignalREvents(boardSignalRService);
        subscribeToScrollEvents(this);

        this.stickerToLoad$
            .pipe(
                concatMap(id => {
                    return this.stickersService.sticker(id.value)
                        .then((stickerDto: StickerDto) => {
                            if (!this.stickers.some(s => s.id === stickerDto.id)) {
                                const sticker = Sticker.create(stickerDto);
                                if (sticker) {
                                    this.addSticker(sticker);
                                }
                            }
                        });
                })
            )
            .subscribe();
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

    public positionOnBoard(screenPosition: Position): Position {
        const positionOnBoard = {
            x: (screenPosition.x - this.position.x) / this.scale,
            y: (screenPosition.y - this.position.y) / this.scale
        };

        return positionOnBoard;
    }

    public get middleButtonClicked$(): Observable<void> {
        return this._middleButtonClicked$.asObservable();
    }

    public get doubleClicked$(): Observable<Position> {
        return this._doubleClicked$.asObservable();
    }

    private updateBoardHtmlLayer() {
        if (this.boardHtmlElementsLayer) {
            this.boardHtmlElementsLayer.style.transform = `scale(${this.scale})`;
            this.boardHtmlElementsLayer.style.top = `${this.position.y}px`;
            this.boardHtmlElementsLayer.style.left = `${this.position.x}px`;
            
            this.viewChangedService.emitViewChanged$();
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

    private subscribeSignalREvents(boardSignalRService: BoardSignalRService) {
        boardSignalRService.stickerMoved()
            .pipe(tap(e => {
                const sticker = this.stickers.find(s => s.id === e.stickerId);
                if (sticker) {
                    sticker.updateElementPosition(e.position);
                } else {
                    this.stickerToLoad$.next(new StickerId(e.stickerId));
                }
            }))
            .subscribe();

        boardSignalRService.stickerTextChanged()
            .pipe(tap(e => {
                const sticker = this.stickers.find(s => s.id === e.stickerId);
                if (sticker) {
                    sticker.updateText(e.text, e.correlationId);
                } else {
                    this.stickerToLoad$.next(new StickerId(e.stickerId));
                }
            }))
            .subscribe();

        boardSignalRService.stickerColorChanged()
            .pipe(tap(e => {
                const sticker = this.stickers.find(s => s.id === e.stickerId);
                if (sticker) {
                    sticker.updateColorFromExternalDevice(e);
                } else {
                    this.stickerToLoad$.next(new StickerId(e.stickerId));
                }
            }))
            .subscribe();

        boardSignalRService.stickerCreated()
            .pipe(
                filter(e => {
                    return !this.stickers.find(s => s.id === e.stickerId);
                }),
                tap(s => this.stickerToLoad$.next(new StickerId(s.stickerId))))
            .subscribe();
    }

    private registerMouseEventHandlers(): void {
        if (this.boardHtmlLayer) {
            this.boardHtmlLayer.addEventListener('mousedown', (e: MouseEvent) => this.onClick(e));
            this.boardHtmlLayer.addEventListener('touchstart', (e: any) => this.onClick(e));

            this.boardHtmlLayer.addEventListener('dblclick', (e: MouseEvent) => this.onDoubleClick(e), { passive: false } as AddEventListenerOptions);
        }
    }

    private onClick(e: MouseEvent): void {
        e.stopPropagation();

        if (e.button === MouseButton.middle) {
            this._middleButtonClicked$.next();
        } else {
            this.selectionService?.clearSelection();
        }
    }

    private onDoubleClick(e: MouseEvent) {
        e.stopPropagation();

        const cursorScreenPosition = { x: e.clientX, y: e.clientY };
        this._doubleClicked$.next(this.positionOnBoard(cursorScreenPosition));
    }
}

class StickerId {
    constructor(public value: string) {
    }
}

export default Board;

