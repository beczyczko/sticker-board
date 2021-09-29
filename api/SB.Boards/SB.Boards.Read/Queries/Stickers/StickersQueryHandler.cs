using System.Collections.Immutable;
using System.Threading.Tasks;
using JetBrains.Annotations;
using SB.Boards.Read.Domain;
using SB.Common.Handlers;
using SB.Common.Mongo;

namespace SB.Boards.Read.Queries.Stickers
{
    //todo db rename to Elements....
    [UsedImplicitly]
    internal class StickersQueryHandler : IQueryHandler<StickersQuery, IImmutableList<Element>>
    {
        private readonly IMongoRepository<Element> _repository;

        public StickersQueryHandler(IMongoRepository<Element> repository)
        {
            _repository = repository;
        }

        public async Task<IImmutableList<Element>> HandleAsync(StickersQuery query)
        {
            var stickers = await _repository.FindAsync(s => s.RemovedMoment == null);

            return stickers.ToImmutableList();
        }
    }
}