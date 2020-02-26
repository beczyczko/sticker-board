using System;
using SB.Common.Messages;

namespace SB.Boards.Commands.AddSticker
{
    public class AddStickerCommand : ICommand
    {
        public Guid Id { get; set; }
        public string Text { get; set; }
        public double PositionX { get; set; }
        public double PositionY { get; set; }
    }
}