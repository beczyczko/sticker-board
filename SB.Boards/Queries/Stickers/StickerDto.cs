using System;
using SB.Boards.Dtos;

namespace SB.Boards.Queries.Stickers
{
    public class StickerDto
    {
        public StickerDto(Guid id, string text, PositionDto position, ColorDto color)
        {
            Id = id;
            Text = text;
            Position = position;
            Color = color;
        }
        
        public Guid Id { get; }
        public string Text { get; }
        public PositionDto Position { get; }
        public ColorDto Color { get; }
    }
}