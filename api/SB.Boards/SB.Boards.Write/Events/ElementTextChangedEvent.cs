using System;
using System.ComponentModel.DataAnnotations;
using MediatR;

namespace SB.Boards.Write.Events
{
    public class ElementTextChangedEvent : INotification
    {
        public ElementTextChangedEvent(string boardId, Guid elementId, string text, Guid correlationId)
        {
            BoardId = boardId;
            ElementId = elementId;
            Text = text;
            CorrelationId = correlationId;
        }

        [Required]
        public string BoardId { get; }
        public Guid ElementId { get; }
        
        [Required]
        public string Text { get; }
        public Guid CorrelationId { get; }
    }
}