import React, { useEffect, useState } from 'react';
import './App.css';
import * as PIXI from 'pixi.js'
import stickerImage from './assets/sticker.png';
import Sticker from './board/sticker';

function App() {

    let stage;

    const loader = new PIXI.Loader();
    loader
        .add('sticker', stickerImage)
        .load();

    const [canvas, setCanvas] = useState('');

    useEffect(() => {
        const canvas = document.getElementById('canvas');

        let app = new PIXI.Application({
            view: canvas,
            width: window.innerWidth,
            height: window.innerHeight - 100,
            backgroundColor: 0x1099bb
        });
        stage = app.stage;

        loader.onComplete.add(() => {
            stage.addChild(Sticker.createSticker(100, 100, 'Basic text in pixisafffffffffffffffffffff, pixisafffffffffffffffff, Basic text in pixi, Basic text in pixi'));
            stage.addChild(Sticker.createSticker(200, 300, 'Basic text in pixisafffffffffffffffffffff, pixisafffffffffffffffff'));
            stage.addChild(Sticker.createSticker(500, 350, 'Basic text in pixisafffffffffffffffffffff'));
        });

        stage.scale.set(0.4);

    }, [canvas]);

    return (
        <div className="App">
            <canvas id="canvas"></canvas>
            {/*<AddStickerDialog open={newStickerCreating}*/}
            {/*                  onCloseHandle={stickerText => handleStickerCreation(stickerText)}>*/}
            {/*</AddStickerDialog>*/}
        </div>
    );
}

export default App;
