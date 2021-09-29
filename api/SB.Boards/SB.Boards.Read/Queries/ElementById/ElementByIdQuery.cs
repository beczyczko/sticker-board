using System;
using CSharpFunctionalExtensions;
using SB.Boards.Read.Domain;
using SB.Common.Types;

namespace SB.Boards.Read.Queries.ElementById
{
    public class ElementByIdQuery : IQuery<Maybe<Element>>
    {
        public ElementByIdQuery(Guid elementId)
        {
            ElementId = elementId;
        }

        public Guid ElementId { get; }
    }
}