import React, { useEffect, useState } from 'react';
import './App.scss';
import { v4 as uuidv4 } from 'uuid';
import Sticker from './board/Sticker';
import Board from './board/Board';
import AddStickerDialog from './add-sticker-dialog/AddStickerDialog';
import ElementToolbox from './ElementToolbox';
import { AddStickerCommand } from './services/services';
import { ServicesProvider } from './services/services-provider';
import { StickerColor } from './board/StickerColor';
import { BoardSignalRService } from './signal-r/BoardSignalRService';
import { BaseAPIUrl } from './app-settings';
import { tap } from 'rxjs/operators';
import { Position } from './board/Position';

function App() {

    let initBoard: () => void;
    const stickersService = ServicesProvider.stickersService;
    const [initialized, setInitialized] = useState(false);
    const [board, setBoard] = useState<Board | undefined>(undefined);
    const [newStickerCreating, setNewStickerCreating] = useState<boolean>(false);
    const [newStickerPosition, setNewStickerPosition] = useState<{ x: number, y: number } | undefined>(undefined);

    useEffect(() => {
        if (!initialized) {
            initBoard();
        }

        setInitialized(true);
    }, [initialized]);

    initBoard = () => {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const newBoard = new Board(
            new BoardSignalRService(BaseAPIUrl),
            stickersService,
            windowWidth,
            windowHeight);
        setBoard(newBoard);

        newBoard.doubleClicked$
            .pipe(tap(clickPosition => onBoardDoubleClick(clickPosition)))
            .subscribe();
    };

    const onBoardDoubleClick = (clickPosition: Position) => {
        setNewStickerPosition(clickPosition);
        setNewStickerCreating(true);
    };

    const handleStickerCreation = (stickerText: string, selectedColor: StickerColor) => {
        if (newStickerPosition && board) {
            const sticker = new Sticker(
                uuidv4(),
                newStickerPosition.x,
                newStickerPosition.y,
                stickerText,
                selectedColor);

            stickersService.create(({
                id: sticker.id,
                positionX: sticker.position.x,
                positionY: sticker.position.y,
                text: stickerText,
                color: selectedColor
            } as AddStickerCommand))
                .then(() => board.addSticker(sticker));
        }
    };

    //todo db move popper logic to Toolbox component
    return (
        <div className="App">
            <AddStickerDialog open={newStickerCreating}
                              setOpen={setNewStickerCreating}
                              onSaveCallback={(stickerText: string, color: StickerColor) => handleStickerCreation(stickerText, color)}>
            </AddStickerDialog>
            <div id="board-html-layer">
                <div id="board-html-elements-layer"></div>
            </div>
            <ElementToolbox>
            </ElementToolbox>
        </div>
    );
}

export default App;
