using System;
using SB.Boards.Common.Domain;
using SB.Boards.Write.Commands.ChangeElementColor;
using SB.Boards.Write.Commands.MoveElement;
using SB.Boards.Write.Domain.Features;

namespace SB.Boards.Write.Domain
{
    internal class Connection : Element, IColorable
    {
        public Connection(Guid id, Anchor start, Anchor end, Color color)
        {
            Id = id;
            Start = start;
            End = end;
            Color = color;

            //todo db i bet something is wrong here
            var centerOffset = end.Position.Subtract(start.Position).Multiply(0.5);
            Position = start.Position.Add(centerOffset);
        }

        public Anchor Start { get; private set; }
        public Anchor End { get; private set; }
        public Color Color { get; private set; }

        public void ChangeColor(ChangeElementColorCommand command)
        {
            Color = new Color(command.NewColor);
        }


        public override void Move(MoveElementCommand command)
        {
            //todo db
        }
    }
}