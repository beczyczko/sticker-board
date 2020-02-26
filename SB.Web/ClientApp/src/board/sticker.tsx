import * as PIXI from 'pixi.js';

const TextureCache = PIXI.utils.TextureCache;

let dragItemOffsetPosition = { x: 0, y: 0 };

class Sticker {
    public dragData: any;

    public element: any;

    constructor(
        public id: string,
        public positionX: number,
        public positionY: number,
        public text: string) {
        const textureCacheElement = TextureCache['sticker'];

        const sticker = new PIXI.Sprite(textureCacheElement);
        sticker.width = sticker.texture.width;
        sticker.height = sticker.texture.height;

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

    onDragEnd() {
        this.element.alpha = 1;

        this.element.dragging = false;

        // set the interaction dragData to null
        this.dragData = null;
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
