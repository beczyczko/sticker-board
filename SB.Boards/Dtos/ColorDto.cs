namespace SB.Boards.Dtos
{
    public class ColorDto
    {
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