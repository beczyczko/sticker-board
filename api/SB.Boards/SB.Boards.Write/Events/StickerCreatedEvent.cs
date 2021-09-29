using System;
using MediatR;

namespace SB.Boards.Write.Events
{
    public class StickerCreatedEvent : INotification
    {
        public StickerCreatedEvent(string boardId, Guid stickerId)
        {
            BoardId = boardId;
            StickerId = stickerId;
        }

        public string BoardId { get; }
        public Guid StickerId { get; }
    }
}