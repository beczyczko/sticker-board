using System;
using SB.Common.Messages;

namespace SB.Boards.Write.Commands.RemoveElement
{
    public class RemoveElementCommand : ICommand
    {
        public RemoveElementCommand(Guid elementId, DateTimeOffset commandMoment, Guid correlationId)
        {
            ElementId = elementId;
            CommandMoment = commandMoment;
            CorrelationId = correlationId;
        }

        public Guid ElementId { get; }
        public DateTimeOffset CommandMoment { get; }
        public Guid CorrelationId { get; }
    }
}