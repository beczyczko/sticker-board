using System.Threading.Tasks;
using CSharpFunctionalExtensions;
using JetBrains.Annotations;
using SB.Boards.Domain;
using SB.Boards.Dtos;
using SB.Common.Handlers;
using SB.Common.Mongo;

namespace SB.Boards.Queries.Stickers.StickerById
{
    [UsedImplicitly]
    internal class StickerByIdQueryHandler : IQueryHandler<StickerByIdQuery, Maybe<StickerDto>>
    {
        private readonly IMongoRepository<Sticker> _repository;

        public StickerByIdQueryHandler(IMongoRepository<Sticker> repository)
        {
            _repository = repository;
        }

        public async Task<Maybe<StickerDto>> HandleAsync(StickerByIdQuery query)
        {
            var sticker = await _repository.GetAsync(query.StickerId);
            return sticker.Map(s => new StickerDto(
                s.Id,
                s.Text,
                new PositionDto(s.Position.X, s.Position.Y),
                new ColorDto(s.Color.Red, s.Color.Green, s.Color.Blue)));
        }
    }
}