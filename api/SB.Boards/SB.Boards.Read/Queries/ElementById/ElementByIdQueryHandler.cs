using System.Threading.Tasks;
using CSharpFunctionalExtensions;
using JetBrains.Annotations;
using SB.Boards.Read.Domain;
using SB.Common.Handlers;
using SB.Common.Mongo;

namespace SB.Boards.Read.Queries.ElementById
{
    [UsedImplicitly]
    internal class ElementByIdQueryHandler : IQueryHandler<ElementByIdQuery, Maybe<Element>>
    {
        private readonly IMongoRepository<Element> _repository;

        public ElementByIdQueryHandler(IMongoRepository<Element> repository)
        {
            _repository = repository;
        }

        public async Task<Maybe<Element>> HandleAsync(ElementByIdQuery query)
        {
            return await _repository.GetAsync(query.ElementId);
        }
    }
}