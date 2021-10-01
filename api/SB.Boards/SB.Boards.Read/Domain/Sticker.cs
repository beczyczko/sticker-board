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
    }
}