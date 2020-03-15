import * as PIXI from 'pixi.js';
import { PositionDto } from '../services/services';
import { ServicesProvider } from '../services/services-provider';
import { StickerColor } from './StickerColor';
import { MouseButton } from './MouseButton';

const TextureCache = PIXI.utils.TextureCache;

let dragItemOffsetPosition = { x: 0, y: 0 };

const stickersServiceProvider = ServicesProvider;
const stickerShadowAlpha = 0.5;

class Sticker {
    private positionBeforeDrag: PositionDto = { x: 0, y: 0 };

    public dragData: any;
    public element: PIXI.Sprite;
    public dragging : boolean = false;

    constructor(
        public id: string,
        positionX: number,
        positionY: number,
        public text: string,
        public color: StickerColor) {

        const innerSticker = new PIXI.Graphics();
        innerSticker.beginFill(this.colorToInt(color));

        innerSticker.drawRect(0, 0, 400, 400);

        const textureCacheElement = TextureCache['sticker_shadow'];
        const sticker = new PIXI.Sprite(textureCacheElement);
        sticker.width = sticker.texture.width;
        sticker.height = sticker.texture.height;

        innerSticker.interactive = true;
        innerSticker.buttonMode = true;

        sticker.alpha = stickerShadowAlpha;
        innerSticker.alpha = 1 / stickerShadowAlpha;

        innerSticker
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

        const textStyle = {
            wordWrap: true,
            wordWrapWidth: 340,
            fontSize: 36,
            align: 'center',
        };
        const textElement = new PIXI.Text(text, textStyle);
        textElement.x = 30;
        textElement.y = 30;

        innerSticker.addChild(textElement);
        sticker.addChild(innerSticker);

        this.element = sticker;

        this.positionBeforeDrag = {
            x: positionX,
            y: positionY
        } as PositionDto;
    }

    colorToInt(color: StickerColor): number {
        return color.red * 256 * 256 + color.green * 256 + color.blue;
    };

    onClick(event: any) {
        if (event.data.button === MouseButton.left) {
            this.onDragStart(event);
        }
    }

    onDragStart(event: any) {
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

    async onDragEnd() {
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

    onDragMove() {
        if (this.dragging) {
            const newPosition = this.dragData.getLocalPosition(this.element.parent);
            this.element.position.x = newPosition.x - dragItemOffsetPosition.x;
            this.element.position.y = newPosition.y - dragItemOffsetPosition.y;
        }
    }
}

export default Sticker;
