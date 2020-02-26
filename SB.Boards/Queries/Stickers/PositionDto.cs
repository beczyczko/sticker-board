namespace SB.Boards.Queries.Stickers
{
    public class PositionDto
    {
        public PositionDto(double x, double y)
        {
            X = x;
            Y = y;
        }

        public double X { get; }
        public double Y { get; }
    }
}