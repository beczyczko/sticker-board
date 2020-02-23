import * as PIXI from 'pixi.js';

const TextureCache = PIXI.utils.TextureCache;

let dragItemOffsetPosition = { x: 0, y: 0 };

const Sticker = {
    createSticker: (positionX, positionY, text) => {
        const textureCacheElement = TextureCache['sticker'];

        const sticker = new PIXI.Sprite(textureCacheElement);
        sticker.width = sticker.texture.width;
        sticker.height = sticker.texture.height;

        sticker.interactive = true;
        sticker.buttonMode = true;

        sticker
            // events for drag start
            .on('mousedown', onDragStart)
            .on('touchstart', onDragStart)
            // events for drag end
            .on('mouseup', onDragEnd)
            .on('mouseupoutside', onDragEnd)
            .on('touchend', onDragEnd)
            .on('touchendoutside', onDragEnd)
            // events for drag move
            .on('mousemove', onDragMove)
            .on('touchmove', onDragMove);

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

        return sticker;
    }
}

function onDragStart(event) {
    // store a reference to the dragData
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch

    this.dragData = event.data;
    this.alpha = 0.5;
    this.dragging = true;

    const clickPosition = this.dragData.getLocalPosition(this.parent);
    dragItemOffsetPosition = {
        x: clickPosition.x - this.x,
        y: clickPosition.y - this.y
    };
}

function onDragEnd() {
    this.alpha = 1;

    this.dragging = false;

    // set the interaction dragData to null
    this.dragData = null;
    dragItemOffsetPosition = { x: 0, y: 0 };
}

function onDragMove() {
    if (this.dragging) {
        const newPosition = this.dragData.getLocalPosition(this.parent);
        this.position.x = newPosition.x - dragItemOffsetPosition.x;
        this.position.y = newPosition.y - dragItemOffsetPosition.y;
    }
}

export default Sticker
