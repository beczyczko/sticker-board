using System.Collections.Generic;
using CSharpFunctionalExtensions;
using SB.Boards.Queries.Stickers;

namespace SB.Boards.Domain
{
    internal class Position : ValueObject
    {
        public Position(double x, double y)
        {
            X = x;
            Y = y;
        }

        public Position(PositionDto position)
        {
            X = position.X;
            Y = position.Y;
        }

        public double X { get; }
        public double Y { get; }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return X;
            yield return Y;
        }
    }
}