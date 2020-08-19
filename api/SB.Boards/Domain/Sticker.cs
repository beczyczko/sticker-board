using System;
using SB.Boards.Commands.AddSticker;
using SB.Boards.Commands.ChangeStickerColor;
using SB.Boards.Commands.ChangeStickerText;
using SB.Boards.Commands.MoveSticker;
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
            Color = new Color(command.Color);

            RemovedMoment = null;
        }

        public Position Position { get; private set; }
        public string Text { get; private set; }
        public Color Color { get; private set; }
        public DateTimeOffset? RemovedMoment { get; private set; }

        public void Move(MoveStickerCommand command)
        {
            Position = new Position(command.Position);
        }

        public void ChangeText(ChangeStickerTextCommand command)
        {
            Text = command.NewText;
        }

        public void ChangeColor(ChangeStickerColorCommand command)
        {
            Color = new Color(command.NewColor);
        }

        public void Remove(RemoveStickerCommand command)
        {
            RemovedMoment = command.CommandMoment;
        }
    }
}