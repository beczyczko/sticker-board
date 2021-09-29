using System;
using SB.Boards.Write.Commands.MoveElement;
using SB.Common.Mongo;
using SB.Common.Types;

namespace SB.Boards.Write.Domain
{
    internal class Anchor : BaseEntity
    {
        public Anchor(SbVector2 position)
        {
            Id = Guid.NewGuid();
            Position = position;
        }

        public SbVector2 Position { get; private set; }

        public void Move(MoveElementCommand command)
        {
            Position = new SbVector2(command.Position.X, command.Position.Y);
        }
    }
}