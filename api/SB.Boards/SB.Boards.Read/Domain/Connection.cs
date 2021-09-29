using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using SB.Boards.Common.Domain;

namespace SB.Boards.Read.Domain
{
    public class Connection : Element
    {
        [Required]
        public Anchor Start { get; private set; }

        [Required]
        public Anchor End { get; private set; }

        [Required]
        public Color Color { get; private set; }

        [Required]
        public IReadOnlyList<Anchor> Anchors => new[] { CenterAnchor, Start, End };
    }
}