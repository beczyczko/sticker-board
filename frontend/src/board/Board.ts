import Sticker from './Sticker';
import { BoardSignalRService } from '../signal-r/BoardSignalRService';
import { concatMap, filter, tap } from 'rxjs/operators';
import { Sticker as StickerApi, ElementsService, Element } from '../services/services';
import { StickerColor } from './StickerColor';
import { Position } from './Position';
import { Observable, Subject } from 'rxjs';
import { MouseButton } from './MouseButton';
import { subscribeToScrollEvents } from './BoardNavigation';
import { SelectionService } from '../services/SelectionService';
import { ViewChangedService } from '../services/ViewChangedService';
import { ElementChangedService } from '../services/ElementChangedService';

class Board {
    private readonly selectionService: SelectionService | undefined;
    private readonly elementsService: ElementsService;
    private readonly viewChangedService: ViewChangedService;
    private _middleButtonClicked$ = new Subject<void>();
    private _doubleClicked$ = new Subject<Position>();
    private elementToLoad$ = new Subject<ElementId>();

    public position: Position = { x: 0, y: 0 };
    public scale: number = 1;

    public stickers = Array<Sticker>();

    public readonly boardHtmlLayer: HTMLElement | null;
    public readonly boardHtmlElementsLayer: HTMLElement | null;

    constructor(
        boardSignalRService: BoardSignalRService,
        elementsService: ElementsService,
        windowWidth: number,
        windowHeight: number) {
        this.boardHtmlElementsLayer = document.getElementById('board-html-elements-layer');
        this.boardHtmlLayer = document.getElementById('board-html-layer');

        this.viewChangedService = new ViewChangedService();
        if (this.boardHtmlLayer) {
            this.selectionService = SelectionService.initialize(this.boardHtmlLayer, this.viewChangedService);
        }

        this.moveToPosition({ x: windowWidth / 2, y: windowHeight / 2 });

        this.elementsService = elementsService;

        this.registerMouseEventHandlers();

        this.loadStickers();
        this.subscribeSignalREvents(boardSignalRService);
        subscribeToScrollEvents(this);

        this.elementToLoad$
            .pipe(
                concatMap(id => {
                    return this.elementsService.element(id.value)
                        .then((element: Element) => {
                            if (element.type === 'Sticker') {
                                const stickerData = element as StickerApi;
                                if (!this.stickers.some(s => s.id === stickerData.id)) {
                                    const sticker = Sticker.create(stickerData);
                                    if (sticker) {
                                        this.addSticker(sticker);
                                    }
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

    public removeElement(element: Sticker): void {
        if (element.stickerHtmlElement) {
            this.boardHtmlElementsLayer?.removeChild(element.stickerHtmlElement);
            const indexOfElement = this.stickers.indexOf(element);
            if (indexOfElement !== -1) {
                this.stickers.splice(indexOfElement, 1);
            }

            ElementChangedService.emitElementChanged$(element);
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
        this.elementsService.elements()
            .then(elements => {
                console.log('loaded elements:', elements);
                elements
                    .filter(x => x.type === 'Sticker')
                    .map(x => x as StickerApi)
                    .forEach(s => {
                        this.addSticker(new Sticker(
                            s.id,
                            s.centerAnchor.position.x,
                            s.centerAnchor.position.y,
                            s.text,
                            StickerColor.create(s.color)));
                    });
            });
    }

    private subscribeSignalREvents(boardSignalRService: BoardSignalRService) {
        boardSignalRService.elementMoved()
            .pipe(tap(e => {
                const sticker = this.stickers.find(s => s.id === e.elementId);
                if (sticker) {
                    sticker.updateElementPosition(e.centerAnchor);
                } else {
                    this.elementToLoad$.next(new ElementId(e.elementId));
                }
            }))
            .subscribe();

        boardSignalRService.elementTextChanged()
            .pipe(tap(e => {
                const sticker = this.stickers.find(s => s.id === e.elementId);
                if (sticker) {
                    sticker.updateText(e.text, e.correlationId);
                } else {
                    this.elementToLoad$.next(new ElementId(e.elementId));
                }
            }))
            .subscribe();

        boardSignalRService.elementColorChanged()
            .pipe(tap(e => {
                const sticker = this.stickers.find(s => s.id === e.elementId);
                if (sticker) {
                    sticker.updateColorFromExternalDevice(e);
                } else {
                    this.elementToLoad$.next(new ElementId(e.elementId));
                }
            }))
            .subscribe();

        boardSignalRService.stickerCreated()
            .pipe(
                filter(e => {
                    return !this.stickers.find(s => s.id === e.stickerId);
                }),
                tap(s => this.elementToLoad$.next(new ElementId(s.stickerId))))
            .subscribe();

        boardSignalRService.elementRemoved()
            .pipe(
                filter(e => {
                    return !!this.stickers.find(s => s.id === e.elementId);
                }),
                tap(e => {
                    const sticker = this.stickers.find(s => s.id === e.elementId);
                    if (sticker) {
                        this.removeElement(sticker);
                    }
                }))
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

class ElementId {
    constructor(public value: string) {
    }
}

export default Board;

