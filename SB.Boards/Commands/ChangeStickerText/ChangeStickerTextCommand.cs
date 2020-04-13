using System;
using SB.Common.Messages;

namespace SB.Boards.Commands.ChangeStickerText
{
    public class ChangeStickerTextCommand : ICommand
    {
        public ChangeStickerTextCommand(Guid stickerId, string newText)
        {
            StickerId = stickerId;
            NewText = newText;
        }

        public Guid StickerId { get; }
        public string NewText { get; }
    }
}