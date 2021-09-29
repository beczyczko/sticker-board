using System;
using MediatR;
using SB.Boards.Common.Dtos;

namespace SB.Boards.Write.Events
{
    //todo db event should be for Element not Sticker
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
        //todo db CenterAnchor
    }
}