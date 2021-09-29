using System;
using System.ComponentModel.DataAnnotations;
using MediatR;

namespace SB.Boards.Write.Events
{
    public class ElementRemovedEvent : INotification
    {
        public ElementRemovedEvent(string boardId, Guid elementId, Guid correlationId)
        {
            BoardId = boardId;
            ElementId = elementId;
            CorrelationId = correlationId;
        }

        [Required]
        public string BoardId { get; }
        public Guid ElementId { get; }
        public Guid CorrelationId { get; }
    }
}