using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using SB.Common.Types;

namespace SB.Common.Mongo
{
    public abstract class BaseEntity : IIdentifiable
    {
        [BsonId]
        [BsonElement("_id")]
        [BsonRepresentation(BsonType.String)]
        public Guid Id { get; protected set; }
    }
}