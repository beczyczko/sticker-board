using System.Collections.Immutable;
using System.Threading.Tasks;
using JetBrains.Annotations;
using SB.Boards.Read.Domain;
using SB.Common.Handlers;
using SB.Common.Mongo;

namespace SB.Boards.Read.Queries.Elements
{
    [UsedImplicitly]
    internal class ElementsQueryHandler : IQueryHandler<ElementsQuery, IImmutableList<Element>>
    {
        private readonly IMongoRepository<Element> _repository;

        public ElementsQueryHandler(IMongoRepository<Element> repository)
        {
            _repository = repository;
        }

        public async Task<IImmutableList<Element>> HandleAsync(ElementsQuery query)
        {
            var elements = await _repository.FindAsync(s => s.RemovedMoment == null);

            return elements.ToImmutableList();
        }
    }
}