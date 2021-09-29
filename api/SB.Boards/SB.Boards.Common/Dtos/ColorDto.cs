using Newtonsoft.Json;

namespace SB.Boards.Common.Dtos
{
    public class ColorDto
    {
        [JsonConstructor]
        public ColorDto(int red, int green, int blue)
        {
            Red = red;
            Green = green;
            Blue = blue;
        }

        public int Red { get; }
        public int Green { get; }
        public int Blue { get; }
    }
}