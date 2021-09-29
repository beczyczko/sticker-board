using System.Collections.Generic;
using System.Collections.Immutable;
using SB.Boards.Common.Dtos;

namespace SB.Boards.Common.Domain
{
    public record Color
    {
        public static IImmutableList<Color> DefaultColors = new List<Color>
        {
            new(245, 246, 248),
            new(255, 249, 177),
            new(245, 209, 40),
            new(208, 225, 122),
            new(213, 246, 146),
            new(166, 204, 245),
            new(103, 198, 192),
            new(35, 191, 231),
            new(255, 157, 72),
            new(234, 148, 187),
            new(241, 108, 127),
            new(179, 132, 187),
        }.ToImmutableList();

        public Color(int red, int green, int blue)
        {
            Red = red;
            Green = green;
            Blue = blue;
        }

        public Color(ColorDto colorDto) : this(colorDto.Red, colorDto.Green, colorDto.Blue)
        {
        }

        public int Red { get; init; }
        public int Green { get; init; }
        public int Blue { get; init; }
    }
}