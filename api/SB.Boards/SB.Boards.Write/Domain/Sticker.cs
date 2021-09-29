using System.Collections.Generic;
using SB.Boards.Common.Domain;
using SB.Boards.Write.Commands.AddSticker;
using SB.Boards.Write.Commands.ChangeElementColor;
using SB.Boards.Write.Commands.ChangeElementText;
using SB.Boards.Write.Commands.MoveElement;
using SB.Boards.Write.Domain.Features;
using SB.Common.Types;

namespace SB.Boards.Write.Domain
{
    internal class Sticker : Element, IColorable, IConnectable, ITextable
    {
        public const int Size = 100;

        public Sticker(AddStickerCommand command)
        {
            Id = command.Id;
            Text = command.Text;
            Color = new Color(command.Color);

            CenterAnchor = new Anchor(new SbVector2(command.PositionX, command.PositionY));
            TopAnchor = new Anchor(new SbVector2(command.PositionX, command.PositionY - Size));
            RightAnchor = new Anchor(new SbVector2(command.PositionX + Size, command.PositionY));
            BottomAnchor = new Anchor(new SbVector2(command.PositionX, command.PositionY + Size));
            LeftAnchor = new Anchor(new SbVector2(command.PositionX - Size, command.PositionY - Size));

            RemovedMoment = null;
        }

        public string Text { get; private set; }
        public Color Color { get; private set; }

        // public Anchor CenterAnchor { get; private set; }
        public Anchor TopAnchor { get; private set; }
        public Anchor RightAnchor { get; private set; }
        public Anchor BottomAnchor { get; private set; }
        public Anchor LeftAnchor { get; private set; }

        // public IReadOnlyList<Anchor> NonTrivialAnchors { get; private set; } //todo db new Anchor could be added when anchor should be outside middle cross

        public IReadOnlyList<Anchor> Anchors => new[]
        {
            CenterAnchor, TopAnchor, RightAnchor, BottomAnchor, LeftAnchor
        };

        public override void Move(MoveElementCommand command)
        {
            CenterAnchor = new Anchor(new SbVector2(command.Position.X, command.Position.Y));
            TopAnchor = new Anchor(new SbVector2(command.Position.X, command.Position.Y - Size));
            RightAnchor = new Anchor(new SbVector2(command.Position.X + Size, command.Position.Y));
            BottomAnchor = new Anchor(new SbVector2(command.Position.X, command.Position.Y + Size));
            LeftAnchor = new Anchor(new SbVector2(command.Position.X - Size, command.Position.Y - Size));
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