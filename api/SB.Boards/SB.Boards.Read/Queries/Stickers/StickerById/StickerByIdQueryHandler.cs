using System.Threading.Tasks;
using CSharpFunctionalExtensions;
using JetBrains.Annotations;
using SB.Boards.Common.Dtos;
using SB.Boards.Read.Domain;
using SB.Common.Handlers;
using SB.Common.Mongo;

namespace SB.Boards.Read.Queries.Stickers.StickerById
{
    [UsedImplicitly]
    internal class StickerByIdQueryHandler : IQueryHandler<StickerByIdQuery, Maybe<StickerDto>>
    {
        private readonly IMongoRepository<Element> _repository;

        public StickerByIdQueryHandler(IMongoRepository<Element> repository)
        {
            _repository = repository;
        }

        public async Task<Maybe<StickerDto>> HandleAsync(StickerByIdQuery query)
        {
            var sticker = await _repository.GetAsync(query.StickerId);
            return sticker
                .Map(s => (Sticker)s)
                .Map(s => new StickerDto(
                s.Id,
                s.Text,
                new ColorDto(s.Color.Red, s.Color.Green, s.Color.Blue),
                new AnchorDto(s.CenterAnchor.Id, s.CenterAnchor.Position)));
        }
    }
}