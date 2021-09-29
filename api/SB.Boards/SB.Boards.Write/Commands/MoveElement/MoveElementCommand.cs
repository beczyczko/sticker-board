using System;
using SB.Common.Messages;
using SB.Common.Types;

namespace SB.Boards.Write.Commands.MoveElement
{
    public class MoveElementCommand : ICommand
    {
        public MoveElementCommand(Guid elementId, SbVector2 position)
        {
            ElementId = elementId;
            Position = position;
        }

        public Guid ElementId { get; }
        public SbVector2 Position { get; }
    }
}