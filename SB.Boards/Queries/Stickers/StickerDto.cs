using System;

namespace SB.Boards.Queries.Stickers
{
    public class StickerDto
    {
        public StickerDto(Guid id, string text, PositionDto position)
        {
            Id = id;
            Text = text;
            Position = position;
        }

        public Guid Id { get; }
        public string Text { get; }
        public PositionDto Position { get; }
    }
}