using System;
using System.ComponentModel.DataAnnotations;

namespace SB.Boards.Common.Dtos
{
    public class StickerDto
    {
        public StickerDto(Guid id, string text, ColorDto color, AnchorDto centerAnchor)
        {
            Id = id;
            Text = text;
            Color = color;
            CenterAnchor = centerAnchor;
        }

        public Guid Id { get; }
        
        [Required]
        public string Text { get; }
        
        [Required]
        public ColorDto Color { get; }
        
        [Required]
        public AnchorDto CenterAnchor { get; }
        //todo db all anchors
    }
}