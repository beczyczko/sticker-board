using Newtonsoft.Json;

namespace SB.Boards.Queries.Stickers
{
    public class PositionDto
    {
        [JsonConstructor]
        public PositionDto(double x, double y)
        {
            X = x;
            Y = y;
        }

        public double X { get; }
        public double Y { get; }
    }
}