using System;
using SB.Boards.Common.Dtos;
using SB.Common.Messages;

namespace SB.Boards.Write.Commands.ChangeElementColor
{
    public class ChangeElementColorCommand : ICommand
    {
        public ChangeElementColorCommand(Guid elementId, ColorDto newColor, Guid correlationId)
        {
            ElementId = elementId;
            NewColor = newColor;
            CorrelationId = correlationId;
        }

        public Guid ElementId { get; }
        public ColorDto NewColor { get; }
        public Guid CorrelationId { get; }
    }
}