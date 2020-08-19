using System;
using MediatR;

namespace SB.Boards.Events
{
    public class StickerRemovedEvent : INotification
    {
        public StickerRemovedEvent(string boardId, Guid stickerId, Guid correlationId)
        {
            BoardId = boardId;
            StickerId = stickerId;
            CorrelationId = correlationId;
        }

        public string BoardId { get; }
        public Guid StickerId { get; }
        public Guid CorrelationId { get; }
    }
}