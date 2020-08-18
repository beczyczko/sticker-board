import React from 'react';
import * as moment from 'moment';
import { ServicesProvider } from '../services/services-provider';
import { v4 as uuidv4 } from 'uuid';
import Sticker from '../board/Sticker';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Board from '../board/Board';

interface RemoveElementProps {
    children: never[],
    element: Sticker,
    board: Board;
}

const stickersService = ServicesProvider.stickersService;

const RemoveElement = ({ element, board }: RemoveElementProps) => {

    const onClickButtonClick = () => {
        board.removeElement(element);

        const correlationId = uuidv4();
        stickersService.remove(element.id, moment.utc(), correlationId)
            .then()
            .catch(() => {
                board.addSticker(element);
            });
    };

    return (
        <div>
            <IconButton aria-label="delete" onClick={onClickButtonClick}>
                <DeleteIcon/>
            </IconButton>
        </div>
    );
};

export default RemoveElement;
