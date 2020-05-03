using System.Threading.Tasks;
using JetBrains.Annotations;
using SB.Boards.Domain;
using SB.Boards.Events;
using SB.Common.Handlers;
using SB.Common.MediatR;
using SB.Common.Mongo;

namespace SB.Boards.Commands.ChangeStickerColor
{
    [UsedImplicitly]
    internal class ChangeStickerColorCommandHandler : ICommandHandler<ChangeStickerColorCommand>
    {
        private readonly IMongoRepository<Sticker> _repository;
        private readonly Publisher _publisher;

        public ChangeStickerColorCommandHandler(IMongoRepository<Sticker> repository, Publisher publisher)
        {
            _repository = repository;
            _publisher = publisher;
        }

        public async Task HandleAsync(ChangeStickerColorCommand command)
        {
            var sticker = (await _repository.GetAsync(command.StickerId)).Value;
            sticker.ChangeColor(command);
            await _repository.UpdateAsync(sticker);

            var stickerColorChangedEvent =
                new StickerColorChangedEvent("testId", sticker.Id, command.NewColor, command.CorrelationId); //todo db boardId unhardcode
            await _publisher.Publish(stickerColorChangedEvent, PublishStrategy.ParallelNoWait);
        }
    }
}