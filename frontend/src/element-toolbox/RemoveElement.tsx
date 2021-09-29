import React from 'react';
import * as moment from 'moment';
import { ServicesProvider } from '../services/services-provider';
import { v4 as uuidv4 } from 'uuid';
import Sticker from '../board/Sticker';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import Board from '../board/Board';
import { deletePressed } from '../services/KeyboardService';
import { Subscription } from 'rxjs';

interface RemoveElementProps {
    children: never[],
    element: Sticker,
    board: Board;
}

const stickersService = ServicesProvider.elementsService;

class RemoveElement extends React.Component<RemoveElementProps> {
    private readonly subscription: Subscription = new Subscription();

    componentDidMount(): void {
        this.subscription.add(deletePressed().subscribe(e => {
            this.removeElement();
        }));
    }

    componentWillUnmount(): void {
        this.subscription.unsubscribe();
    }

    removeElement(): void {
        const { element, board } = this.props;
        board.removeElement(element);

        const correlationId = uuidv4();
        stickersService.remove(element.id, moment.utc(), correlationId)
            .then()
            .catch(() => {
                board.addSticker(element);
            });
    };

    render() {
        return (
            <Tooltip title="Delete">
                <IconButton aria-label="delete"
                            onClick={() => this.removeElement()}>
                    <DeleteIcon/>
                </IconButton>
            </Tooltip>
        );
    }
}

export default RemoveElement;
