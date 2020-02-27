using System.Threading.Tasks;
using JetBrains.Annotations;
using SB.Boards.Domain;
using SB.Common.Handlers;
using SB.Common.Mongo;

namespace SB.Boards.Commands.MoveSticker
{
    [UsedImplicitly]
    internal class MoveStickerCommandHandler : ICommandHandler<MoveStickerCommand>
    {
        private readonly IMongoRepository<Sticker> _repository;

        public MoveStickerCommandHandler(IMongoRepository<Sticker> repository)
        {
            _repository = repository;
        }

        public async Task HandleAsync(MoveStickerCommand command)
        {
            var sticker = (await _repository.GetAsync(command.StickerId)).Value;
            sticker.Move(command);
            await _repository.UpdateAsync(sticker);
        }
    }
}