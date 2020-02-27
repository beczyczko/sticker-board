import React, { useEffect, useState } from 'react';
import './App.css';
import * as PIXI from 'pixi.js'
import { v4 as uuidv4 } from 'uuid';
import stickerImage from './assets/sticker.png';
import Sticker from './board/sticker';
import Board from './board/board';
import AddStickerDialog from './add-sticker-dialog/AddStickerDialog';
import { AddStickerCommand } from './services/services';
import { ServicesProvider } from './services/services-provider';

function App() {

    const stickersService = ServicesProvider.stickersService;

    const loader = new PIXI.Loader();
    loader
        .add('sticker', stickerImage)
        .load();

    const [canvas, setCanvas] = useState();
    const [board, setBoard] = useState<Board | undefined>(undefined);
    const [newStickerCreating, setNewStickerCreating] = useState<boolean>(false);
    const [newStickerPosition, setNewStickerPosition] = useState<{ x: number, y: number } | undefined>(undefined);

    const onBoardDoubleClick = (clickPosition: any) => {
        setNewStickerPosition(clickPosition);
        setNewStickerCreating(true);
    };

    useEffect(() => {
        const canvas = document.getElementById('canvas');

        let app = new PIXI.Application({
            view: canvas,
            width: window.innerWidth,
            height: window.innerHeight - 100
        } as any);

        const stage = app.stage;
        stage.scale.set(0.4);

        const newBoard = new Board(stage, clickPosition => onBoardDoubleClick(clickPosition));
        setBoard(newBoard);

        loader.onComplete.add(() => {
            stickersService.stickersGet()
                .then(stickers => {
                    stickers.forEach(s => {
                        if (s.position && s.text)
                            newBoard.addSticker(new Sticker(
                                s.id,
                                s.position.x,
                                s.position.y,
                                s.text));
                    });
                });
        });
    }, [canvas]);

    const handleStickerCreation = (stickerText: string) => {
        if (newStickerPosition && board) {
            const sticker = new Sticker(uuidv4(), newStickerPosition.x, newStickerPosition.y, stickerText);

            stickersService.stickersPost(({
                id: sticker.id,
                positionX: sticker.element.x,
                positionY: sticker.element.y,
                text: sticker.text
            } as AddStickerCommand))
                .then(() => board.addSticker(sticker));
        }
    };

    return (
        <div className="App">
            <canvas id="canvas"></canvas>
            <AddStickerDialog open={newStickerCreating}
                              setOpen={setNewStickerCreating}
                              onSaveCallback={(stickerText: string) => handleStickerCreation(stickerText)}>
            </AddStickerDialog>
        </div>
    );
}

export default App;
