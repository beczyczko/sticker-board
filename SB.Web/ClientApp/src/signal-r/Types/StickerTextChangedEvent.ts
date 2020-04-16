export class StickerTextChangedEvent {
    constructor(
        public boardId: string,
        public stickerId: string,
        public text: string,
        public correlationId: string) {
    }
}

