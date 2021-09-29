using System;
using MediatR;
using SB.Boards.Common.Dtos;

namespace SB.Boards.Write.Events
{
    public class StickerColorChangedEvent : INotification
    {
        public StickerColorChangedEvent(string boardId, Guid stickerId, ColorDto newColor, Guid correlationId)
        {
            BoardId = boardId;
            StickerId = stickerId;
            NewColor = newColor;
            CorrelationId = correlationId;
        }

        public string BoardId { get; }
        public Guid StickerId { get; }
        public ColorDto NewColor { get; }
        public Guid CorrelationId { get; }
    }
}