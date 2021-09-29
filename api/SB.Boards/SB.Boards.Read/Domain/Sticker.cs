using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using SB.Boards.Common.Domain;

namespace SB.Boards.Read.Domain
{
    public class Sticker : Element
    {
        [Required]
        public string Text { get; private set; }
        
        [Required]
        public Color Color { get; private set; }

        // public Anchor CenterAnchor { get; private set; }
        
        [Required]
        public Anchor TopAnchor { get; private set; }
        
        [Required]
        public Anchor RightAnchor { get; private set; }
        
        [Required]
        public Anchor BottomAnchor { get; private set; }
        
        [Required]
        public Anchor LeftAnchor { get; private set; }

        // public IReadOnlyList<Anchor> NonTrivialAnchors { get; private set; } //todo db new Anchor could be added when anchor should be outside middle cross

        [Required]
        public IReadOnlyList<Anchor> Anchors => new[]
        {
            CenterAnchor, TopAnchor, RightAnchor, BottomAnchor, LeftAnchor
        };
    }
}