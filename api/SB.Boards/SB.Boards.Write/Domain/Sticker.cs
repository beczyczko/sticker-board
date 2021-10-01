using SB.Boards.Common.Domain;
using SB.Boards.Write.Commands.AddSticker;
using SB.Boards.Write.Commands.ChangeElementColor;
using SB.Boards.Write.Commands.ChangeElementText;
using SB.Boards.Write.Commands.MoveElement;
using SB.Boards.Write.Domain.Features;
using SB.Common.Types;

namespace SB.Boards.Write.Domain
{
    internal class Sticker : Element, IColorable, ITextable
    {
        public const int Size = 100;

        public Sticker(AddStickerCommand command)
        {
            Id = command.Id;
            Text = command.Text;
            Color = new Color(command.Color);

            Position = new SbVector2(command.PositionX, command.PositionY);

            RemovedMoment = null;
        }

        public string Text { get; private set; }
        public Color Color { get; private set; }

        public override void Move(MoveElementCommand command)
        {
            Position = new SbVector2(command.Position.X, command.Position.Y);
        }

        public void ChangeText(ChangeElementTextCommand command)
        {
            Text = command.NewText;
        }

        public void ChangeColor(ChangeElementColorCommand command)
        {
            Color = new Color(command.NewColor);
        }
    }
}