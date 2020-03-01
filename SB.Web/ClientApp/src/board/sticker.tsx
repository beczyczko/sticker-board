import { AdjustmentFilter } from '@pixi/filter-adjustment';
import * as PIXI from 'pixi.js';
import { PositionDto } from '../services/services';
import { ServicesProvider } from '../services/services-provider';
import { StickerColor } from './sticker-color';

const TextureCache = PIXI.utils.TextureCache;

let dragItemOffsetPosition = { x: 0, y: 0 };

const stickersServiceProvider = ServicesProvider;

class Sticker {
    private positionBeforeDrag: PositionDto = { x: 0, y: 0 };

    public dragData: any;
    public element: any;

    constructor(
        public id: string,
        positionX: number,
        positionY: number,
        public text: string,
        public color: StickerColor) { //todo db handle no color returned from API?
        const textureCacheElement = TextureCache['sticker'];

        const sticker = new PIXI.Sprite(textureCacheElement);
        sticker.width = sticker.texture.width;
        sticker.height = sticker.texture.height;

        sticker.filters = [new AdjustmentFilter({
            red: color.red / 255,
            green: color.green / 255,
            blue: color.blue / 255
        })];

        sticker.interactive = true;
        sticker.buttonMode = true;

        sticker
            // events for drag start
            .on('mousedown', (e: any) => this.onDragStart(e))
            .on('touchstart', (e: any) => this.onDragStart(e))
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

        sticker.addChild(textElement);

        this.element = sticker;

        this.positionBeforeDrag = {
            x: positionX,
            y: positionY
        } as PositionDto;
    }

    onDragStart(event: any) {
        // store a reference to the dragData
        // the reason for this is because of multitouch
        // we want to track the movement of this particular touch

        this.dragData = event.data;
        this.element.alpha = 0.5;
        this.element.dragging = true;

        const clickPosition = this.dragData.getLocalPosition(this.element.parent);
        dragItemOffsetPosition = {
            x: clickPosition.x - this.element.x,
            y: clickPosition.y - this.element.y
        };
    }

    async onDragEnd() {
        this.element.alpha = 1;
        this.element.dragging = false;

        this.dragData = null;

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

        dragItemOffsetPosition = { x: 0, y: 0 };
    }

    onDragMove() {
        if (this.element.dragging) {
            const newPosition = this.dragData.getLocalPosition(this.element.parent);
            this.element.position.x = newPosition.x - dragItemOffsetPosition.x;
            this.element.position.y = newPosition.y - dragItemOffsetPosition.y;
        }
    }
}

export default Sticker;
