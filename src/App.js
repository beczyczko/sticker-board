import React, { useEffect, useState } from 'react';
import './App.css';
import * as PIXI from 'pixi.js'
import stickerImage from './sticker.jpg';

function App() {
    const sprites = {};

    const loader = new PIXI.Loader();
    loader.add('sticker', stickerImage);

    loader.load((loader, resources) => {
        sprites.sticker = new PIXI.TilingSprite(resources.sticker.texture);
    });

    const [canvas, setCanvas] = useState('');

    useEffect(() => {

        const canvas = document.getElementById('canvas');

        let app = new PIXI.Application({
            view: canvas,
            width: window.innerWidth,
            height: 600,
            backgroundColor: 0x1099bb
        });

        loader.onComplete.add(() => {
            const sticker = sprites.sticker;
            sticker.x = app.renderer.width / 2;
            sticker.y = app.renderer.height / 2;
            app.stage.addChild(sticker);
        }); // called once when the queued resources all load.

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
