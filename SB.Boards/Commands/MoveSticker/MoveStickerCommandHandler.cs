using System.Threading.Tasks;
using JetBrains.Annotations;
using SB.Boards.Domain;
using SB.Boards.Events;
using SB.Boards.Queries.Stickers;
using SB.Common.Handlers;
using SB.Common.MediatR;
using SB.Common.Mongo;

namespace SB.Boards.Commands.MoveSticker
{
    [UsedImplicitly]
    internal class MoveStickerCommandHandler : ICommandHandler<MoveStickerCommand>
    {
        private readonly IMongoRepository<Sticker> _repository;
        private readonly Publisher _publisher;

        public MoveStickerCommandHandler(IMongoRepository<Sticker> repository, Publisher publisher)
        {
            _repository = repository;
            _publisher = publisher;
        }

        public async Task HandleAsync(MoveStickerCommand command)
        {
            var sticker = (await _repository.GetAsync(command.StickerId)).Value;
            sticker.Move(command);
            await _repository.UpdateAsync(sticker);

            var stickerMovedEvent =
                new StickerMovedEvent("testId", sticker.Id, new PositionDto(sticker.Position.X, sticker.Position.Y)); //todo db boardId unhardcode
            await _publisher.Publish(stickerMovedEvent, PublishStrategy.ParallelNoWait);
        }
    }
}