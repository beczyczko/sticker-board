namespace SB.Boards.Queries.Stickers
{
    public class StickerDto
    {
        public StickerDto(string text, PositionDto position)
        {
            Text = text;
            Position = position;
        }

        public string Text { get; }
        public PositionDto Position { get; }
    }
}