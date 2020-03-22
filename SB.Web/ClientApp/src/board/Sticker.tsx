import * as PIXI from 'pixi.js';
import { interaction } from 'pixi.js';
import { PositionDto } from '../services/services';
import { ServicesProvider } from '../services/services-provider';
import { StickerColor } from './StickerColor';
import { MouseButton } from './MouseButton';

const TextureCache = PIXI.utils.TextureCache;

let dragItemOffsetPosition = { x: 0, y: 0 };

const stickersServiceProvider = ServicesProvider;
const stickerShadowAlpha = 0.5;

class Sticker {
    private lastTimeClicked = 0;
    private positionBeforeDrag: PositionDto = { x: 0, y: 0 };
    private innerSticker: PIXI.Graphics;
    private stickerHtmlElement: HTMLElement | undefined;
    private stickerTextHtmlElement: HTMLElement | undefined;

    public dragData: any;
    public element: PIXI.Sprite;
    public dragging: boolean = false;
    public selected = false;

    constructor(
        public id: string,
        positionX: number,
        positionY: number,
        public text: string,
        public color: StickerColor) {

        this.innerSticker = new PIXI.Graphics();
        this.innerSticker.beginFill(this.colorToInt(color));

        this.innerSticker.drawRect(0, 0, 400, 400);

        const textureCacheElement = TextureCache['sticker_shadow'];
        const sticker = new PIXI.Sprite(textureCacheElement);
        sticker.width = sticker.texture.width;
        sticker.height = sticker.texture.height;

        this.innerSticker.interactive = true;
        this.innerSticker.buttonMode = true;

        sticker.alpha = stickerShadowAlpha;
        this.innerSticker.alpha = 1 / stickerShadowAlpha;

        this.innerSticker
            // events for drag start
            .on('mousedown', (e: any) => this.onClick(e))
            .on('touchstart', (e: any) => this.onClick(e))
            // events for drag end
            .on('mouseup', () => this.onDragEnd())
            .on('mouseupoutside', () => this.onDragEnd())
            .on('touchend', () => this.onDragEnd())
            .on('touchendoutside', () => this.onDragEnd())
            // events for drag move
            .on('mousemove', () => this.onDragMove())
            .on('touchmove', () => this.onDragMove());

        sticker.x = positionX;
        sticker.y = positionY;
        //
        // const textStyle = {
        //     wordWrap: true,
        //     wordWrapWidth: 340,
        //     fontSize: 36,
        //     align: 'center',
        // };
        // const textElement = new PIXI.Text(text, textStyle);
        // textElement.x = 30;
        // textElement.y = 30;
        //
        // this.innerSticker.addChild(textElement);
        sticker.addChild(this.innerSticker);

        this.element = sticker;

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
        // todo db sticker move not working
        const position = this.element.position;
        const stickerWidth = this.innerSticker.width;
        const stickerHeight = this.innerSticker.height;

        const textHtmlElementId = `sticker-text-${this.id}`;

        const textHtmlElement = document.createElement('p');
        textHtmlElement.id = textHtmlElementId;
        textHtmlElement.innerText = this.text;

        textHtmlElement.style.border = 'none';
        textHtmlElement.style.background = 'transparent';
        textHtmlElement.style.padding = '24px';
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
        sticker.style.top = `${position.y}px`;
        sticker.style.left = `${position.x}px`;
        sticker.style.width = `${stickerWidth}px`;
        sticker.style.height = `${stickerHeight}px`;
        sticker.style.border = '1px solid darkorchid';
        sticker.style.margin = '-1px';
        sticker.style.transformOrigin = '0 0';
        // sticker.style.transform = 'scale(0.4)'; //todo bd

        sticker.appendChild(textHtmlElement);

        this.stickerHtmlElement = sticker;

        const htmlLayer = document.getElementById('board-html-layer');
        htmlLayer?.appendChild(sticker);

        this.fitText(stickerWidth, stickerHeight);
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
            textArea.style.fontSize = `${(fontSize - 2)}px`;
            this.fitText(maxWidth, maxHeight);
        }
    }

    public move(position: PositionDto): void {
        this.element.position.set(position.x, position.y);
    }

    private get maxWordLength(): number {
        const wordsLength = this.text.split(' ')
            .map(t => t.length);
        return Math.max(...wordsLength);
    }

    private colorToInt(color: StickerColor): number {
        return color.red * 256 * 256 + color.green * 256 + color.blue;
    };

    private onClick(event: interaction.InteractionEvent): void {
        console.log(event);
        event.stopPropagation();

        const clickTime = Date.now();

        if (clickTime - this.lastTimeClicked < 300) {
            this.lastTimeClicked = 0;
            this.onDoubleClick();
        } else {
            this.lastTimeClicked = clickTime;

            if (event.data.button === MouseButton.left) {
                this.onDragStart(event);
            }
        }
    }

    private onDragStart(event: any): void {
        // store a reference to the dragData
        // the reason for this is because of multitouch
        // we want to track the movement of this particular touch
        this.dragData = event.data;
        this.element.alpha = 0.4;
        this.dragging = true;

        const board = this.element.parent;
        const clickPosition = this.dragData.getLocalPosition(board);
        dragItemOffsetPosition = {
            x: clickPosition.x - this.element.x,
            y: clickPosition.y - this.element.y
        };
    }

    private async onDragEnd(): Promise<void> {
        this.element.alpha = stickerShadowAlpha;
        this.dragging = false;

        this.dragData = null;

        const positionChanged = this.positionBeforeDrag.x !== this.element.x || this.positionBeforeDrag.y !== this.element.y;
        if (positionChanged) {
            stickersServiceProvider.stickersService.move(
                this.id,
                {
                    x: this.element.x,
                    y: this.element.y
                } as PositionDto)
                .then(() => {
                    this.positionBeforeDrag = {
                        x: this.element.x,
                        y: this.element.y
                    } as PositionDto
                })
                .catch(() => {
                    this.element.x = this.positionBeforeDrag.x;
                    this.element.y = this.positionBeforeDrag.y;
                });
        }

        dragItemOffsetPosition = { x: 0, y: 0 };
    }

    private onDragMove(): void {
        if (this.dragging) {
            const newPosition = this.dragData.getLocalPosition(this.element.parent);
            this.element.position.x = newPosition.x - dragItemOffsetPosition.x;
            this.element.position.y = newPosition.y - dragItemOffsetPosition.y;
        }
    }

    private onDoubleClick(): void {
        console.log('should edit');
        //todo db edit
        // this.showEditField('div', 'edit-sticker-' + this.id);
    }
}

export default Sticker;
