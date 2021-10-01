using System;
using System.ComponentModel.DataAnnotations;
using MongoDB.Bson.Serialization.Attributes;
using SB.Common.Mongo;
using SB.Common.Types;

namespace SB.Boards.Read.Domain
{
    [BsonDiscriminator(Required = true)]
    [BsonKnownTypes(typeof(Sticker), typeof(Connection))]
    public abstract class Element : BaseEntity
    {
        [BsonElement("_t")]
        [Required]
        public string Type { get; protected set; }

        [Required]
        public SbVector2 Position { get; protected set; }

        [Required]
        public DateTimeOffset? RemovedMoment { get; protected set; }
    }
}