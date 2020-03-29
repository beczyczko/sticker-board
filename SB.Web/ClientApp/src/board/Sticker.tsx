import { PositionDto } from '../services/services';
import { ServicesProvider } from '../services/services-provider';
import { StickerColor } from './StickerColor';
import { MouseButton } from './MouseButton';
import { cursorPosition, mouseUp } from '../services/MouseService';
import { Subscription } from 'rxjs';
import { Position } from './Position';
import { boardScaleValue } from './BoardScaleService';

let dragItemOffsetPosition = { x: 0, y: 0 };

const stickersServiceProvider = ServicesProvider;
const stickerShadowAlpha = 0.5;

class Sticker {
    private cursorSubscriptions = new Array<Subscription>();
    private positionBeforeDrag: Position = { x: 0, y: 0 };
    private stickerHtmlElement: HTMLElement | undefined;
    private stickerTextHtmlElement: HTMLElement | undefined;

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
        } as PositionDto;
    }

    // private showEditField(elementTag, elementId) {
    //     // todo db clean this
    //     const bounds = this.innerSticker.getBounds();
    //
    //     //todo db to html element, not .inner html - it would be easier to work with it later
    //     const textHtmlElementId = `sticker-text-${elementId}`;
    //     const html = `    <p id="${textHtmlElementId}" style="border: none; background: transparent; padding: 0; text-align: center; width: inherit; height: fit-content;">
    //                         ${this.text}
    //                         </p>
    //                 `;
    //     const newElement = document.createElement(elementTag);
    //     newElement.setAttribute('id', elementId);
    //     const style = ` position: absolute; top: ${bounds.top.toString()}px; left: ${bounds.left.toString()}px;
    //                     width: ${bounds.width}px;
    //                     height: ${bounds.width}px;`;
    //     newElement.setAttribute('style', style);
    //     newElement.innerHTML = html;
    //
    //     document.body.appendChild(newElement);
    //     this.fitText(bounds.width);
    // }

    public showTextField() {
        // todo db clean this
        const textHtmlElementId = `sticker-text-${this.id}`;

        const textHtmlElement = document.createElement('p');
        textHtmlElement.id = textHtmlElementId;
        textHtmlElement.innerText = this.text;

        textHtmlElement.style.border = 'none';
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
        sticker.id = `sticker-${this.id}`;
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

        this.fitText(this.width, this.height);
        this.addClickEventListeners();
    }

    private fitText(maxWidth: number, maxHeight: number): void {
        // todo db clean this
        const textArea = this.stickerTextHtmlElement;
        if (!textArea) {
            return;
        }

        const computedStyle = window.getComputedStyle(textArea);
        const fontSize = Number(computedStyle.fontSize.slice(0, computedStyle.fontSize.indexOf('px')));

        if (this.maxWordLength > 15) {
            textArea.style.wordBreak = 'break-word';
        }

        const width = textArea.clientWidth;
        const height = textArea.clientHeight;

        if (height > maxHeight || width > maxWidth) {
            textArea.style.fontSize = `${(fontSize - 1)}px`;
            this.fitText(maxWidth, maxHeight);
        }
    }

    private addClickEventListeners(): void {
        this.stickerHtmlElement?.addEventListener('mousedown', (e: MouseEvent) => this.onClick(e));
        this.stickerHtmlElement?.addEventListener('touchstart', (e: any) => this.onClick(e));

        this.stickerHtmlElement?.addEventListener('dblclick', () => this.onDoubleClick());
        this.stickerHtmlElement?.addEventListener('dblclick', () => this.onDoubleClick());
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

    public move(position: PositionDto): void {
        this.position = { x: position.x, y: position.y };
    }

    private get maxWordLength(): number {
        const wordsLength = this.text.split(' ')
            .map(t => t.length);
        return Math.max(...wordsLength);
    }

    private onClick(event: MouseEvent): void {
        event.stopPropagation();

        if (event.button === MouseButton.left) {
            this.onDragStart(event);
            this.addCursorMoveEventListeners();
            this.addClickEndEventListeners();
        }
    }

    private onDragStart(event: any): void {
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

    private onDragEnd(): void {
        this.dragging = false;

        this.removeMouseSubscriptions();

        const positionChanged = this.positionBeforeDrag.x !== this.position.x || this.positionBeforeDrag.y !== this.position.y;
        if (positionChanged) {
            stickersServiceProvider.stickersService.move(
                this.id,
                {
                    x: this.position.x,
                    y: this.position.y
                } as PositionDto)
                .then(() => {
                    this.positionBeforeDrag = {
                        x: this.position.x,
                        y: this.position.y
                    } as PositionDto;
                })
                .catch(() => {
                    this.position.x = this.positionBeforeDrag.x;
                    this.position.y = this.positionBeforeDrag.y;
                });
        }

        dragItemOffsetPosition = { x: 0, y: 0 };
    }

    private onDragMove(cursorPosition: Position): void {
        const boardScale = boardScaleValue();
        if (this.dragging) {
            const newElementPosition = {
                x: cursorPosition.x / boardScale - dragItemOffsetPosition.x,
                y: cursorPosition.y / boardScale - dragItemOffsetPosition.y
            };

            this.updateElementPosition(newElementPosition);
        }
    }

    private onDoubleClick(): void {
        console.log('should edit');
        //todo db edit
        // this.showEditField('div', 'edit-sticker-' + this.id);
    }

    private updateElementPosition(position: Position): void {
        this.position = position;

        if (this.stickerHtmlElement) {
            this.stickerHtmlElement.style.top = `${this.position.y}px`;
            this.stickerHtmlElement.style.left = `${this.position.x}px`;
        }
    }
}

export default Sticker;
