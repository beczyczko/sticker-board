using System.Collections.Generic;
using System.Collections.Immutable;
using CSharpFunctionalExtensions;
using SB.Boards.Common.Dtos;

namespace SB.Boards.Common.Domain
{
    //todo db to record
    public class Color : ValueObject
    {
        public static IImmutableList<Color> DefaultColors = new List<Color>
        {
            new Color(245, 246, 248),
            new Color(255, 249, 177),
            new Color(245, 209, 40),
            new Color(208, 225, 122),
            new Color(213, 246, 146),
            new Color(166, 204, 245),
            new Color(103, 198, 192),
            new Color(35, 191, 231),
            new Color(255, 157, 72),
            new Color(234, 148, 187),
            new Color(241, 108, 127),
            new Color(179, 132, 187),
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

        public int Red { get; }
        public int Green { get; }
        public int Blue { get; }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Red;
            yield return Green;
            yield return Blue;
        }
    }
}