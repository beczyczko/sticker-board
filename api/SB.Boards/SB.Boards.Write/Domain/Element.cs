using System;
using MongoDB.Bson.Serialization.Attributes;
using SB.Boards.Write.Commands.MoveElement;
using SB.Boards.Write.Commands.RemoveElement;
using SB.Common.Mongo;
using SB.Common.Types;

namespace SB.Boards.Write.Domain
{
    [BsonDiscriminator(Required = true)]
    [BsonKnownTypes(typeof(Sticker), typeof(Connection))]
    internal abstract class Element : BaseEntity
    {
        protected Element()
        {
            Type = GetType().Name;
        }

        [BsonElement("_t")]
        public string Type { get; protected set; }
        public SbVector2 Position { get; protected set; }
        public abstract void Move(MoveElementCommand command);
        public DateTimeOffset? RemovedMoment { get; protected set; }

        public void Remove(RemoveElementCommand command)
        {
            RemovedMoment = command.CommandMoment;
        }
    }
}