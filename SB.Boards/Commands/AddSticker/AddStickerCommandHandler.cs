using System.Threading.Tasks;
using JetBrains.Annotations;
using SB.Boards.Domain;
using SB.Common.Handlers;
using SB.Common.Mongo;

namespace SB.Boards.Commands.AddSticker
{
    [UsedImplicitly]
    internal class AddStickerCommandHandler : ICommandHandler<AddStickerCommand>
    {
        private readonly IMongoRepository<Sticker> _repository;

        public AddStickerCommandHandler(IMongoRepository<Sticker> repository)
        {
            _repository = repository;
        }

        public async Task HandleAsync(AddStickerCommand command)
        {
            var sticker = new Sticker(command);
            await _repository.AddAsync(sticker);
        }
    }
}