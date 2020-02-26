using System.Collections.Immutable;
using System.Linq;
using System.Threading.Tasks;
using JetBrains.Annotations;
using SB.Boards.Domain;
using SB.Common.Handlers;
using SB.Common.Mongo;

namespace SB.Boards.Queries.Stickers
{
    [UsedImplicitly]
    internal class StickersQueryHandler : IQueryHandler<StickersQuery, IImmutableList<StickerDto>>
    {
        private readonly IMongoRepository<Sticker> _repository;

        public StickersQueryHandler(IMongoRepository<Sticker> repository)
        {
            _repository = repository;
        }

        public async Task<IImmutableList<StickerDto>> HandleAsync(StickersQuery query)
        {
            var stickers = await _repository.FindAsync(s => true);

            return stickers
                .Select(s => new StickerDto(
                    s.Text,
                    new PositionDto(s.Position.X, s.Position.Y)))
                .ToImmutableList();
        }
    }
}