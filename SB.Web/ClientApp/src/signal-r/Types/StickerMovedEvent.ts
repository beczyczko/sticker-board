import { PositionDto } from '../../services/services';

export class StickerMovedEvent {
    constructor(public boardId: string, public stickerId: string, public position: PositionDto) {
    }
}

