using System.Collections.Generic;

namespace SB.Boards.Write.Domain.Features
{
    internal interface IConnectable
    {
        IReadOnlyList<Anchor> Anchors { get; }
    }
}