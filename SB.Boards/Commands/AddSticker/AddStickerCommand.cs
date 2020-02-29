using System;
using Newtonsoft.Json;
using SB.Common.Messages;

namespace SB.Boards.Commands.AddSticker
{
    public class AddStickerCommand : ICommand
    {
        public Guid Id { get; }
        public string Text { get; }
        public double PositionX { get; }
        public double PositionY { get; }

        [JsonConstructor]
        public AddStickerCommand(Guid id, string text, double positionX, double positionY)
        {
            Id = id;
            Text = text;
            PositionX = positionX;
            PositionY = positionY;
        }
    }
}