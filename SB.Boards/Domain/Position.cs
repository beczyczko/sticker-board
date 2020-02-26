using System.Collections.Generic;
using CSharpFunctionalExtensions;
using MongoDB.Bson.Serialization.Attributes;

namespace SB.Boards.Domain
{
    internal class Position : ValueObject
    {
        public Position(double x, double y)
        {
            X = x;
            Y = y;
        }

        [BsonElement("x")]
        public double X { get; }

        [BsonElement("y")]
        public double Y { get; }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return X;
            yield return Y;
        }
    }
}