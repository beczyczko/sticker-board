import { PositionDto } from '../../services/services';

export class StickerMovedEvent {
    // todo db it would be nice if this class was generated by some tool automatically like with NSwagStudio for API
    constructor(public stickerId: string, public position: PositionDto) {
    }
}