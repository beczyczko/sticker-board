using System;
using SB.Boards.Dtos;
using SB.Common.Messages;

namespace SB.Boards.Commands.ChangeStickerColor
{
    public class ChangeStickerColorCommand : ICommand
    {
        public ChangeStickerColorCommand(Guid stickerId, ColorDto newColor, Guid correlationId)
        {
            StickerId = stickerId;
            NewColor = newColor;
            CorrelationId = correlationId;
        }

        public Guid StickerId { get; }
        public ColorDto NewColor { get; }
        public Guid CorrelationId { get; }
    }
}