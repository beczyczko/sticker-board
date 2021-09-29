using System.ComponentModel.DataAnnotations;
using SB.Common.Mongo;
using SB.Common.Types;

namespace SB.Boards.Read.Domain
{
    public class Anchor : BaseEntity
    {
        [Required]
        public SbVector2 Position { get; private set; }
    }
}