using System.Threading.Tasks;
using JetBrains.Annotations;
using SB.Boards.Domain;
using SB.Common.Handlers;
using SB.Common.MediatR;
using SB.Common.Mongo;

namespace SB.Boards.Commands.ChangeStickerText
{
    [UsedImplicitly]
    internal class ChangeStickerTextCommandHandler : ICommandHandler<ChangeStickerTextCommand>
    {
        private readonly IMongoRepository<Sticker> _repository;
        private readonly Publisher _publisher;

        public ChangeStickerTextCommandHandler(IMongoRepository<Sticker> repository, Publisher publisher)
        {
            _repository = repository;
            _publisher = publisher;
        }

        public async Task HandleAsync(ChangeStickerTextCommand command)
        {
            var sticker = (await _repository.GetAsync(command.StickerId)).Value;
            sticker.ChangeText(command);
            await _repository.UpdateAsync(sticker);

            //todo db signalR event
            // var stickerMovedEvent =
                // new StickerMovedEvent("testId", sticker.Id, new PositionDto(sticker.Position.X, sticker.Position.Y)); //todo db boardId unhardcode
            // await _publisher.Publish(stickerMovedEvent, PublishStrategy.ParallelNoWait);
        }
    }
}