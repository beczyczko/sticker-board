using System;
using SB.Boards.Queries.Stickers;
using SB.Common.Messages;

namespace SB.Boards.Commands.MoveSticker
{
    public class MoveStickerCommand : ICommand
    {
        public MoveStickerCommand(Guid stickerId, PositionDto position)
        {
            StickerId = stickerId;
            Position = position;
        }

        public Guid StickerId { get; }
        public PositionDto Position { get; }
    }
}