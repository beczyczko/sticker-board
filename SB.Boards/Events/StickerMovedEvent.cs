using System;
using SB.Boards.Queries.Stickers;

namespace SB.Boards.Events
{
    public class StickerMovedEvent // todo db use mediatr: INotification
    {
        public StickerMovedEvent(Guid stickerId, PositionDto position)
        {
            StickerId = stickerId;
            Position = position;
        }

        public Guid StickerId { get; }
        public PositionDto Position { get; }
    }
}