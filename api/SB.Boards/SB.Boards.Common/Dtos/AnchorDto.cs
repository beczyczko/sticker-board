using System;
using System.ComponentModel.DataAnnotations;
using SB.Common.Types;

namespace SB.Boards.Common.Dtos
{
    public class AnchorDto
    {
        public AnchorDto(Guid id, SbVector2 position)
        {
            Id = id;
            Position = position;
        }

        public Guid Id { get; }
        
        [Required]
        public SbVector2 Position { get; }
    }
}