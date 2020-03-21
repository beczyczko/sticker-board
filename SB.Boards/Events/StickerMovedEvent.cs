using System;
using MediatR;
using SB.Boards.Queries.Stickers;

namespace SB.Boards.Events
{
    public class StickerMovedEvent : INotification
    {
        public StickerMovedEvent(string boardId, Guid stickerId, PositionDto position)
        {
            BoardId = boardId;
            StickerId = stickerId;
            Position = position;
        }

        public string BoardId { get; }
        public Guid StickerId { get; }
        public PositionDto Position { get; }
    }
}