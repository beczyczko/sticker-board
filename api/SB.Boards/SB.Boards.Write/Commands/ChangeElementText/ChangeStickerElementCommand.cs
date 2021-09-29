using System;
using SB.Common.Messages;

namespace SB.Boards.Write.Commands.ChangeElementText
{
    public class ChangeElementTextCommand : ICommand
    {
        public ChangeElementTextCommand(Guid elementId, string newText, Guid correlationId)
        {
            ElementId = elementId;
            NewText = newText;
            CorrelationId = correlationId;
        }

        public Guid ElementId { get; }
        public string NewText { get; }
        public Guid CorrelationId { get; }
    }
}