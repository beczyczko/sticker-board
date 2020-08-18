export class StickerRemovedEvent {
    constructor(public boardId: string, public stickerId: string, public correlationId: string) {
    }
}
