using System;
using System.ComponentModel.DataAnnotations;
using MediatR;
using SB.Common.Types;

namespace SB.Boards.Write.Events
{
    public class ElementMovedEvent : INotification
    {
        public ElementMovedEvent(string boardId, Guid elementId, SbVector2 position)
        {
            BoardId = boardId;
            ElementId = elementId;
            Position = position;
        }

        [Required]
        public string BoardId { get; }
        public Guid ElementId { get; }

        [Required]
        public SbVector2 Position { get; }
    }
}