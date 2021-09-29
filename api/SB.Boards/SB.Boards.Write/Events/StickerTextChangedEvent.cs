using System;
using MediatR;

namespace SB.Boards.Write.Events
{
    public class StickerTextChangedEvent : INotification
    {
        public StickerTextChangedEvent(string boardId, Guid stickerId, string text, Guid correlationId)
        {
            BoardId = boardId;
            StickerId = stickerId;
            Text = text;
            CorrelationId = correlationId;
        }

        public string BoardId { get; }
        public Guid StickerId { get; }
        public string Text { get; }
        public Guid CorrelationId { get; }
    }
}