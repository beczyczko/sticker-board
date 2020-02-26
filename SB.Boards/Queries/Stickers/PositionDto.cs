namespace SB.Boards.Queries.Stickers
{
    public class PositionDto
    {
        public PositionDto(int x, int y)
        {
            X = x;
            Y = y;
        }

        public int X { get; }
        public int Y { get; }
    }
}