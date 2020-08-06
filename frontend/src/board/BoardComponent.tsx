import { ServicesProvider } from '../services/services-provider';
import React, { useEffect, useState } from 'react';
import Board from './Board';
import { BoardSignalRService } from '../signal-r/BoardSignalRService';
import { config } from '../app-settings';
import { tap } from 'rxjs/operators';
import { Position } from './Position';
import { StickerColor } from './StickerColor';
import Sticker from './Sticker';
import { v4 as uuidv4 } from 'uuid';
import { AddStickerCommand } from '../services/services';
import AddStickerDialog from '../add-sticker-dialog/AddStickerDialog';
import ElementToolbox from '../ElementToolbox';

export function BoardComponent() {
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

    const initBoard = () => {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const newBoard = new Board(
            new BoardSignalRService(config.BASE_API_URL),
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

    return (
        <div>
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
