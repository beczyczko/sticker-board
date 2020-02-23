import React, { useEffect, useState } from 'react';
import './App.css';
import * as PIXI from 'pixi.js'
import stickerImage from './assets/sticker.png';

function App() {

    let TextureCache = PIXI.utils.TextureCache;
    let stage;

    const loader = new PIXI.Loader();
    loader
        .add('sticker', stickerImage)
        .load();

    const [canvas, setCanvas] = useState('');

    const createSticker = (positionX, positionY, text) => {
        const textureCacheElement = TextureCache['sticker'];
        console.log(textureCacheElement);

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

        stage.addChild(sticker);
    };

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

    useEffect(() => {
        const canvas = document.getElementById('canvas');

        let app = new PIXI.Application({
            view: canvas,
            width: window.innerWidth,
            height: 600,
            backgroundColor: 0x1099bb
        });
        stage = app.stage;

        loader.onComplete.add(() => {
            createSticker(100, 100, 'Basic text in pixisafffffffffffffffffffff, pixisafffffffffffffffff, Basic text in pixi, Basic text in pixi');
            createSticker(200, 300, 'Basic text in pixisafffffffffffffffffffff, pixisafffffffffffffffff');
            createSticker(500, 350, 'Basic text in pixisafffffffffffffffffffff');
        });

        app.stage.scale.set(0.4);

    }, [canvas]);

    return (
        <div className="App">
            <canvas id="canvas"></canvas>
            <div id="test-event-sticker" className="sticker">Event sticker</div>
            {/*<AddStickerDialog open={newStickerCreating}*/}
            {/*                  onCloseHandle={stickerText => handleStickerCreation(stickerText)}>*/}
            {/*</AddStickerDialog>*/}
        </div>
    );
}

export default App;
