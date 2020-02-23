import * as PIXI from "pixi.js";

const TextureCache = PIXI.utils.TextureCache;

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
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
}

function onDragEnd() {
    this.alpha = 1;

    this.dragging = false;

    // set the interaction data to null
    this.data = null;
}

function onDragMove() {
    if (this.dragging) {
        const newPosition = this.data.getLocalPosition(this.parent);
        this.position.x = newPosition.x;
        this.position.y = newPosition.y;
    }
}

export default Sticker
