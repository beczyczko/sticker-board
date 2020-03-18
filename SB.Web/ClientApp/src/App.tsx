import React, { useEffect, useState } from 'react';
import './App.scss';
import * as PIXI from 'pixi.js'
import { v4 as uuidv4 } from 'uuid';
import stickerShadowImage from './assets/sticker_shadow.png';
import Sticker from './board/Sticker';
import Board from './board/Board';
import AddStickerDialog from './add-sticker-dialog/AddStickerDialog';
import { AddStickerCommand } from './services/services';
import { ServicesProvider } from './services/services-provider';
import { StickerColor } from './board/StickerColor';
import { subscribeToScrollEvents } from './board/BoardNavigation';
import { BoardSignalRService } from './board/signal-r/BoardSignalRService';
import { BaseAPIUrl } from './app-settings';

function App() {

    let pixiLoader;

    const stickersService = ServicesProvider.stickersService;
    const [initialized, setInitialized] = useState(false);
    const [canvas, setCanvas] = useState();
    const [board, setBoard] = useState<Board | undefined>(undefined);
    const [newStickerCreating, setNewStickerCreating] = useState<boolean>(false);
    const [newStickerPosition, setNewStickerPosition] = useState<{ x: number, y: number } | undefined>(undefined);

    const onBoardDoubleClick = (clickPosition: any) => {
        setNewStickerPosition(clickPosition);
        setNewStickerCreating(true);
    };

    useEffect(() => {
        if (!initialized) {
            pixiLoader = new PIXI.Loader();
            pixiLoader
                .add('sticker_shadow', stickerShadowImage)
                .load();
        }

        setInitialized(true);
    }, [initialized]);


    useEffect(() => {
        const canvas = document.getElementById('canvas');

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        let app = new PIXI.Application({
            view: canvas,
            width: windowWidth,
            height: windowHeight - 4 // todo db can't remove that -4 px, fix this
        } as any);

        const newBoard = new Board(
            app.stage,
            clickPosition => onBoardDoubleClick(clickPosition),
            new BoardSignalRService(BaseAPIUrl));

        newBoard.container.scale.set(0.4);
        newBoard.container.x = windowWidth / 2;
        newBoard.container.y = windowHeight / 2;

        setBoard(newBoard);

        subscribeToScrollEvents(newBoard);

        pixiLoader.onComplete.add(() => {
            stickersService.stickersGet()
                .then(stickers => {
                    stickers.forEach(s => {
                        if (s.position && s.text && s.color)
                            newBoard.addSticker(new Sticker(
                                s.id,
                                s.position.x,
                                s.position.y,
                                s.text,
                                StickerColor.create(s.color)));
                    });
                });
        });
    }, [canvas]);

    const handleStickerCreation = (stickerText: string, selectedColor: StickerColor) => {
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
                              onSaveCallback={(stickerText: string, color: StickerColor) => handleStickerCreation(stickerText, color)}>
            </AddStickerDialog>
        </div>
    );
}

export default App;
