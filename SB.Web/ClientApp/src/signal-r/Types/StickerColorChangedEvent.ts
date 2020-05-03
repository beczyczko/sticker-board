import { ColorDto } from '../../services/services';

export class StickerColorChangedEvent {
    constructor(
        public boardId: string,
        public stickerId: string,
        public newColor: ColorDto,
        public correlationId: string) {
    }
}
