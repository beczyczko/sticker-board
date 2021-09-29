import { ColorDto, ElementColorChangedEvent, SbVector2, Sticker as StickerApi } from '../services/services';
import { ServicesProvider } from '../services/services-provider';
import { StickerColor } from './StickerColor';
import { MouseButton } from './MouseButton';
import { cursorPosition, mouseUp } from '../services/MouseService';
import { Subject, Subscription } from 'rxjs';
import { Position } from './Position';
import { boardScaleValue } from './BoardScaleService';
import { concatMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { SelectionService } from '../services/SelectionService';
import { ElementChangedService } from '../services/ElementChangedService';

let dragItemOffsetPosition = { x: 0, y: 0 };

const stickersService = ServicesProvider.elementsService;

enum DisplayMode {
    Read,
    Modify
}

class Sticker {
    private selectionService: SelectionService | undefined;
    private commandCorrelationIds = new Set<string>();

    private cursorSubscriptions = new Array<Subscription>();
    private positionBeforeDrag: Position = { x: 0, y: 0 };
    private stickerTextHtmlElement: HTMLElement | undefined;
    private displayMode: DisplayMode = DisplayMode.Read;
    private textChanged = new Subject<string>();

    public stickerHtmlElement: HTMLElement | undefined;
    public dragging: boolean = false;
    public selected = false;
    public width = 200;
    public height = 200;
    public position: Position;

    constructor(
        public id: string,
        positionX: number,
        positionY: number,
        public text: string,
        public color: StickerColor) {

        this.position = { x: positionX, y: positionY };

        this.positionBeforeDrag = {
            x: positionX,
            y: positionY
        } as SbVector2;

        this.textChanged
            .pipe(
                debounceTime(200),
                distinctUntilChanged(),
                concatMap(t => {
                    const correlationId = uuidv4();
                    this.commandCorrelationIds.add(correlationId);
                    return stickersService
                        .text(this.id, this.text, correlationId)
                        .then()
                })
            )
            .subscribe();
        SelectionService.instance$.subscribe(ss => this.selectionService = ss);
    }

    public static create(stickerDto: StickerApi): Sticker | undefined {
        if (stickerDto) {
            return new Sticker(
                stickerDto.id,
                stickerDto.centerAnchor.position.x,
                stickerDto.centerAnchor.position.y,
                stickerDto.text,
                StickerColor.create(stickerDto.color)
            );
        } else {
            return undefined;
        }
    }

    public get htmlElementId(): string {
        return `sticker-${this.id}`;
    }

    public updateColor(newColor: StickerColor): void {
        const oldColor = this.color;
        this.color = newColor;

        if (this.stickerHtmlElement) {
            this.stickerHtmlElement.style.background = newColor.toStyleString();
        }

        const correlationId = uuidv4();
        this.commandCorrelationIds.add(correlationId);
        stickersService
            .color(this.id, correlationId, newColor as ColorDto)
            .then()
            .catch(() => {
                this.color = oldColor;
                if (this.stickerHtmlElement) {
                    this.stickerHtmlElement.style.background = oldColor.toStyleString();
                }
            });
    }

    public updateColorFromExternalDevice($event: ElementColorChangedEvent): void {
        if (this.commandCorrelationIds.has($event.correlationId)) {
            this.commandCorrelationIds.delete($event.correlationId);
            return;
        }

        const newColor = StickerColor.create($event.newColor);

        this.color = newColor;
        if (this.stickerHtmlElement) {
            this.stickerHtmlElement.style.background = newColor.toStyleString();
        }
    }

    //todo db every element should have method render() or something like that
    public showTextField() {
        const textHtmlElementId = `sticker-text-${this.id}`;

        const textHtmlElement = document.createElement('p');
        textHtmlElement.id = textHtmlElementId;
        textHtmlElement.innerText = this.text;

        textHtmlElement.style.border = 'none';
        textHtmlElement.style.outline = 'none';
        textHtmlElement.style.background = 'transparent';
        textHtmlElement.style.padding = '16px';
        textHtmlElement.style.margin = 'auto';
        textHtmlElement.style.textAlign = 'center';
        textHtmlElement.style.width = 'fit-content';
        textHtmlElement.style.height = 'fit-content';
        textHtmlElement.style.userSelect = 'none';
        textHtmlElement.style.fontSize = `100px`;

        this.stickerTextHtmlElement = textHtmlElement;

        const sticker = document.createElement('div');
        sticker.id = this.htmlElementId;
        sticker.style.position = 'fixed';
        sticker.style.display = 'flex';
        sticker.style.top = `${this.position.y}px`;
        sticker.style.left = `${this.position.x}px`;
        sticker.style.width = `${(this.width)}px`;
        sticker.style.height = `${(this.height)}px`;
        sticker.style.background = this.color.toStyleString();
        sticker.style.boxShadow = '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)';

        sticker.appendChild(textHtmlElement);

        this.stickerHtmlElement = sticker;

        const htmlLayer = document.getElementById('board-html-elements-layer');
        htmlLayer?.appendChild(sticker);

        this.fitText(textHtmlElement);
        this.addClickEventListeners();
    }

    public updateElementPosition(position: Position): void {
        this.position = position;

        if (this.stickerHtmlElement) {
            this.stickerHtmlElement.style.top = `${this.position.y}px`;
            this.stickerHtmlElement.style.left = `${this.position.x}px`;
        }

        ElementChangedService.emitElementChanged$(this);
    }

    public updateText(newText: string, correlationId: string): void {
        if (this.commandCorrelationIds.has(correlationId)) {
            this.commandCorrelationIds.delete(correlationId);
            return;
        }

        if (newText !== this.text) {
            this.text = newText;
            if (this.stickerTextHtmlElement) {
                this.stickerTextHtmlElement.innerText = newText;
                this.fitText(this.stickerTextHtmlElement);
            }
        }
    }

    private fitText(
        textElement: HTMLElement | undefined,
        minimumFontFit: number = 1,
        maximumFontFit: number = 100): void {
        const maxHeight = this.height;
        const maxWidth = this.width;

        if (!textElement) {
            return;
        }

        const computedStyle = window.getComputedStyle(textElement);
        const fontSize = Number(computedStyle.fontSize.slice(0, computedStyle.fontSize.indexOf('px')));

        if (this.maxWordLength > 15) {
            textElement.style.wordBreak = 'break-word';
        }

        const width = textElement.clientWidth;
        const height = textElement.scrollHeight;
        const textIsTooBig = height > maxHeight || width > maxWidth;

        if (minimumFontFit === maximumFontFit) {
            textElement.style.fontSize = `${(minimumFontFit)}px`;
        } else if (!textIsTooBig) {
            minimumFontFit = fontSize;
            textElement.style.fontSize = `${(fontSize + 1)}px`;
            this.fitText(textElement, minimumFontFit, maximumFontFit);
        } else if (textIsTooBig) {
            maximumFontFit = fontSize - 1;
            textElement.style.fontSize = `${(fontSize - 1)}px`;
            this.fitText(textElement, minimumFontFit, maximumFontFit);
        }
    }

    private addClickEventListeners(): void {
        if (this.stickerHtmlElement) {
            this.stickerHtmlElement.style.zIndex = '100';

            this.stickerHtmlElement.addEventListener('mousedown', (e: MouseEvent) => this.onClick(e));
            this.stickerHtmlElement.addEventListener('touchstart', (e: any) => this.onClick(e));

            this.stickerHtmlElement.addEventListener('dblclick', (e: MouseEvent) => this.onDoubleClick(e), { passive: false } as AddEventListenerOptions);
        }
    }

    private addCursorMoveEventListeners(): void {
        this.cursorSubscriptions.push(cursorPosition().subscribe(position => this.onDragMove(position)));
    }

    private addClickEndEventListeners(): void {
        this.cursorSubscriptions.push(mouseUp().subscribe(() => this.onDragEnd()));
    }

    private removeMouseSubscriptions() {
        this.cursorSubscriptions.forEach(s => s.unsubscribe());
        this.cursorSubscriptions = new Array<Subscription>();
    }

    private get maxWordLength(): number {
        if (!this.text) {
            return 0;
        }

        const wordsLength = this.text.split(' ')
            .map(t => t.length);
        return Math.max(...wordsLength);
    }

    private onClick(e: MouseEvent): void {
        e.stopPropagation();

        if (e.button === MouseButton.left) {
            this.onDragStart(e);
            this.addCursorMoveEventListeners();
            this.addClickEndEventListeners();
        }
    }

    private select(): void {
        this.selected = true;
    }

    private removeSelection(): void {
        this.selected = false;
    }

    private onDragStart(event: any): void {
        if (!this.selected) {
            this.dragging = true;

            const boardScale = boardScaleValue();
            const clickPositionInBoardScale = {
                x: event.clientX / boardScale,
                y: event.clientY / boardScale
            };

            dragItemOffsetPosition = {
                x: (clickPositionInBoardScale.x - this.position.x),
                y: (clickPositionInBoardScale.y - this.position.y)
            };
        }
    }

    private onDragEnd(): void {
        this.dragging = false;

        this.removeMouseSubscriptions();

        const positionChanged = this.positionBeforeDrag.x !== this.position.x || this.positionBeforeDrag.y !== this.position.y;
        if (positionChanged) {
            stickersService.position(
                this.id,
                {
                    x: this.position.x,
                    y: this.position.y
                } as SbVector2)
                .then(() => {
                    this.positionBeforeDrag = {
                        x: this.position.x,
                        y: this.position.y
                    } as SbVector2;
                })
                .catch(() => {
                    this.position.x = this.positionBeforeDrag.x;
                    this.position.y = this.positionBeforeDrag.y;
                });
        } else {
            if (this.stickerHtmlElement) {
                this.selectionService?.selectElement(true, this);
            }
        }

        dragItemOffsetPosition = { x: 0, y: 0 };
    }

    private onDragMove(cursorPosition: Position): void {
        const boardScale = boardScaleValue();
        if (this.dragging) {
            const newElementPosition = {
                x: parseFloat((cursorPosition.x / boardScale - dragItemOffsetPosition.x).toFixed(4)),
                y: parseFloat((cursorPosition.y / boardScale - dragItemOffsetPosition.y).toFixed(4))
            };

            this.updateElementPosition(newElementPosition);
        }
    }

    private onDoubleClick(e: MouseEvent) {
        e.stopPropagation();

        if (this.displayMode === DisplayMode.Read) {
            if (this.stickerHtmlElement && this.stickerTextHtmlElement) {
                this.displayMode = DisplayMode.Modify;
                this.stickerTextHtmlElement.contentEditable = 'true';

                placeCaretAtEnd(this.stickerTextHtmlElement);
                this.select();

                const onKeyDown = (e: KeyboardEvent) => {
                    setTimeout(() => {
                        if (this.stickerTextHtmlElement) {
                            this.text = this.stickerTextHtmlElement.innerText;
                            this.textChanged.next(this.text);
                            this.fitText(this.stickerTextHtmlElement);
                        }
                    }, 0);
                };
                this.stickerHtmlElement.addEventListener('keydown', onKeyDown);

                const onFocusOut = (e: FocusEvent) => {
                    if (this.stickerTextHtmlElement && this.stickerHtmlElement) {
                        this.displayMode = DisplayMode.Read;
                        this.stickerTextHtmlElement.contentEditable = 'false';

                        this.removeSelection();

                        this.stickerHtmlElement.removeEventListener('keydown', onKeyDown);
                        this.stickerHtmlElement.removeEventListener('focusout', onFocusOut);
                    }
                };
                this.stickerHtmlElement.addEventListener('focusout', onFocusOut);
            }
        }
    }
}

function placeCaretAtEnd(element: HTMLElement) {
    // https://stackoverflow.com/questions/28270302/jquery-how-to-focus-on-last-character-of-div
    element.focus();
    const range = document.createRange();
    range.selectNodeContents(element);
    range.collapse(false);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
}

export default Sticker;
