using System;
using System.ComponentModel.DataAnnotations;
using MediatR;
using SB.Common.Types;

namespace SB.Boards.Write.Events
{
    public class ElementMovedEvent : INotification
    {
        public ElementMovedEvent(string boardId, Guid elementId, SbVector2 centerAnchor)
        {
            BoardId = boardId;
            ElementId = elementId;
            CenterAnchor = centerAnchor;
        }

        [Required]
        public string BoardId { get; }
        public Guid ElementId { get; }

        [Required]
        public SbVector2 CenterAnchor { get; }
    }
}