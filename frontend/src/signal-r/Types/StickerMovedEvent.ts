import { SbVector2 } from '../../services/services';

export class StickerMovedEvent {
    constructor(public boardId: string, public stickerId: string, public position: SbVector2) {
    }
}
