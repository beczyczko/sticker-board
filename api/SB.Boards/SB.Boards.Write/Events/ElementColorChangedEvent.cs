using System;
using System.ComponentModel.DataAnnotations;
using MediatR;
using SB.Boards.Common.Dtos;

namespace SB.Boards.Write.Events
{
    public class ElementColorChangedEvent : INotification
    {
        public ElementColorChangedEvent(string boardId, Guid elementId, ColorDto newColor, Guid correlationId)
        {
            BoardId = boardId;
            ElementId = elementId;
            NewColor = newColor;
            CorrelationId = correlationId;
        }

        [Required]
        public string BoardId { get; }
        public Guid ElementId { get; }
        
        [Required]
        public ColorDto NewColor { get; }
        public Guid CorrelationId { get; }
    }
}