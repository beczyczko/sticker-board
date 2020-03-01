import React, { useEffect, useState } from 'react';
import './App.scss';
import * as PIXI from 'pixi.js'
import { v4 as uuidv4 } from 'uuid';
import stickerImage from './assets/sticker.png';
import Sticker from './board/sticker';
import Board from './board/board';
import AddStickerDialog from './add-sticker-dialog/AddStickerDialog';
import { AddStickerCommand, ColorDto } from './services/services';
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
                                s.text,
                                { red: 1, green: 1, blue: 1 } as ColorDto)); //todo db get color from api
                    });
                });
        });
    }, [canvas]);

    const handleStickerCreation = (stickerText: string, selectedColor: ColorDto) => {
        debugger;
        if (newStickerPosition && board) {
            const sticker = new Sticker(
                uuidv4(),
                newStickerPosition.x,
                newStickerPosition.y,
                stickerText,
                selectedColor);

            stickersService.stickersPost(({
                id: sticker.id,
                positionX: sticker.element.x,
                positionY: sticker.element.y,
                text: sticker.text,
                color: selectedColor
            } as AddStickerCommand))
                .then(() => board.addSticker(sticker));
        }
    };

    return (
        <div className="App">
            <canvas id="canvas"></canvas>
            <AddStickerDialog open={newStickerCreating}
                              setOpen={setNewStickerCreating}
                              onSaveCallback={(stickerText: string, color: ColorDto) => handleStickerCreation(stickerText, color)}>
            </AddStickerDialog>
        </div>
    );
}

export default App;
