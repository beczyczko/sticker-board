using Newtonsoft.Json;

namespace SB.Boards.Common.Dtos
{
    //todo db should be removed, use SbVector2 instead
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