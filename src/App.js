import React, { useEffect, useState } from 'react';
import './App.css';
import * as PIXI from 'pixi.js'
import stickerImage from './assets/sticker.png';
import Sticker from './board/sticker';
import StickersRepo from './board/stickersRepoMock';
import Board from './board/board';
import AddStickerDialog from './add-sticker-dialog/AddStickerDialog';

function App() {

    const loader = new PIXI.Loader();
    loader
        .add('sticker', stickerImage)
        .load();

    const [canvas, setCanvas] = useState('');
    const [board, setBoard] = useState(null);
    const [newStickerCreating, setNewStickerCreating] = useState(false);
    const [newStickerPosition, setNewStickerPosition] = useState(null);

    const onBoardDoubleClick = clickPosition => {
        setNewStickerPosition(clickPosition);
        setNewStickerCreating(true);
    };

    useEffect(() => {
        const canvas = document.getElementById('canvas');

        let app = new PIXI.Application({
            view: canvas,
            width: window.innerWidth,
            height: window.innerHeight - 100,
        });

        const stage = app.stage;
        stage.scale.set(0.4);

        const newBoard = new Board(stage, clickPosition => onBoardDoubleClick(clickPosition));
        setBoard(newBoard);

        loader.onComplete.add(() => {
            const stickers = StickersRepo.get().map(s => Sticker.createSticker(s.x, s.y, s.text));
            stickers.forEach(s => newBoard.addSticker(s));
        });
    }, [canvas]);

    const handleStickerCreation = (stickerText) => {
        const sticker = Sticker.createSticker(newStickerPosition.x, newStickerPosition.y, stickerText);
        board.addSticker(sticker);
    }

    return (
        <div className="App">
            <canvas id="canvas"></canvas>
            <AddStickerDialog open={newStickerCreating}
                              setOpen={setNewStickerCreating}
                              onSaveCallback={stickerText => handleStickerCreation(stickerText)}>
            </AddStickerDialog>
        </div>
    );
}

export default App;
