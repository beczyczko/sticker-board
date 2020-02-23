import React, { useEffect, useState } from 'react';
import './App.css';
import * as PIXI from 'pixi.js'
import stickerImage from './assets/sticker.png';

function App() {

    let TextureCache = PIXI.utils.TextureCache;

    const loader = new PIXI.Loader();
    loader
        .add('sticker', stickerImage)
        .load();

    const [canvas, setCanvas] = useState('');

    const createSticker = (positionX, positionY) => {
        const textureCacheElement = TextureCache['sticker'];
        console.log(textureCacheElement);

        const sticker = new PIXI.TilingSprite(textureCacheElement);
        sticker.width = sticker.texture.width;
        sticker.height = sticker.texture.height;

        sticker.scale = { x: 0.25, y: 0.25 };

        sticker.x = positionX;
        sticker.y = positionY;

        return sticker;
    };

    useEffect(() => {
        const canvas = document.getElementById('canvas');

        let app = new PIXI.Application({
            view: canvas,
            width: window.innerWidth,
            height: 600,
            backgroundColor: 0x1099bb
        });

        loader.onComplete.add(() => {
            const sticker = createSticker(100, 100);
            app.stage.addChild(sticker);

            const sticker2 = createSticker(200, 400);
            app.stage.addChild(sticker2);
        });

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
