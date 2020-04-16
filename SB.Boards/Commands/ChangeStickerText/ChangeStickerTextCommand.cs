using System;
using SB.Common.Messages;

namespace SB.Boards.Commands.ChangeStickerText
{
    public class ChangeStickerTextCommand : ICommand
    {
        public ChangeStickerTextCommand(Guid stickerId, string newText, Guid correlationId)
        {
            StickerId = stickerId;
            NewText = newText;
            CorrelationId = correlationId;
        }

        public Guid StickerId { get; }
        public string NewText { get; }
        public Guid CorrelationId { get; }
    }
}