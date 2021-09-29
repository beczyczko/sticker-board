using Newtonsoft.Json;

namespace SB.Boards.Common.Dtos
{
    public record ColorDto
    {
        [JsonConstructor]
        public ColorDto(int red, int green, int blue)
        {
            Red = red;
            Green = green;
            Blue = blue;
        }

        public int Red { get; init; }
        public int Green { get; init; }
        public int Blue { get; init; }
    }
}