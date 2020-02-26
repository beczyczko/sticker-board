using System.Collections.Generic;
using CSharpFunctionalExtensions;
using MongoDB.Bson.Serialization.Attributes;

namespace SB.Boards.Domain
{
    internal class Position : ValueObject
    {
        public Position(int x, int y)
        {
            X = x;
            Y = y;
        }

        [BsonElement("x")]
        public int X { get; }

        [BsonElement("y")]
        public int Y { get; }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return X;
            yield return Y;
        }
    }
}