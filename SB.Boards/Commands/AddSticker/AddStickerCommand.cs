using System;
using Newtonsoft.Json;
using SB.Boards.Dtos;
using SB.Common.Messages;

namespace SB.Boards.Commands.AddSticker
{
    public class AddStickerCommand : ICommand
    {
        public Guid Id { get; }
        public string Text { get; }
        public double PositionX { get; }
        public double PositionY { get; }
        public ColorDto Color { get; }

        [JsonConstructor]
        public AddStickerCommand(
            Guid id,
            string text,
            double positionX,
            double positionY,
            ColorDto color)
        {
            Id = id;
            Text = text;
            PositionX = positionX;
            PositionY = positionY;
            Color = color;
        }
    }
}