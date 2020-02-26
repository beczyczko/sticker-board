using MongoDB.Bson.Serialization.Attributes;
using SB.Boards.Commands.AddSticker;
using SB.Common.Mongo;

namespace SB.Boards.Domain
{
    internal class Sticker : BaseEntity
    {
        public Sticker(AddStickerCommand command)
        {
            Id = command.Id;
            Text = command.Text;
            Position = new Position(command.PositionX, command.PositionY);
        }

        [BsonElement("position")]

        public Position Position { get; private set; }

        [BsonElement("text")]
        public string Text { get; private set; }
    }
}