using System.Threading.Tasks;
using JetBrains.Annotations;
using SB.Boards.Domain;
using SB.Boards.Events;
using SB.Common.Handlers;
using SB.Common.MediatR;
using SB.Common.Mongo;

namespace SB.Boards.Commands.AddSticker
{
    [UsedImplicitly]
    internal class AddStickerCommandHandler : ICommandHandler<AddStickerCommand>
    {
        private readonly IMongoRepository<Sticker> _repository;
        private readonly Publisher _publisher;

        public AddStickerCommandHandler(IMongoRepository<Sticker> repository, Publisher publisher)
        {
            _repository = repository;
            _publisher = publisher;
        }

        public async Task HandleAsync(AddStickerCommand command)
        {
            var sticker = new Sticker(command);
            await _repository.AddAsync(sticker);

            var stickerMovedEvent =
                new StickerCreatedEvent(
                    "testId", //todo db boardId unhardcode
                    sticker.Id);
            await _publisher.Publish(stickerMovedEvent, PublishStrategy.ParallelNoWait);
        }
    }
}