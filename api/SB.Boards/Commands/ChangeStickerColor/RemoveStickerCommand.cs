using System;
using System.Threading.Tasks;
using JetBrains.Annotations;
using SB.Boards.Domain;
using SB.Boards.Events;
using SB.Common.Handlers;
using SB.Common.MediatR;
using SB.Common.Messages;
using SB.Common.Mongo;

namespace SB.Boards.Commands.ChangeStickerColor
{
    public class RemoveStickerCommand : ICommand
    {
        public RemoveStickerCommand(Guid stickerId, DateTimeOffset commandMoment, Guid correlationId)
        {
            StickerId = stickerId;
            CommandMoment = commandMoment;
            CorrelationId = correlationId;
        }

        public Guid StickerId { get; }
        public DateTimeOffset CommandMoment { get; }
        public Guid CorrelationId { get; }

        [UsedImplicitly]
        internal class RemoveStickerCommandHandler : ICommandHandler<RemoveStickerCommand>
        {
            private readonly IMongoRepository<Sticker> _repository;
            private readonly Publisher _publisher;

            public RemoveStickerCommandHandler(IMongoRepository<Sticker> repository, Publisher publisher)
            {
                _repository = repository;
                _publisher = publisher;
            }

            public async Task HandleAsync(RemoveStickerCommand command)
            {
                var sticker = (await _repository.GetAsync(command.StickerId)).Value;
                sticker.Remove(command);
                await _repository.UpdateAsync(sticker);

                var stickerColorChangedEvent =
                    new StickerRemovedEvent("testId", sticker.Id, command.CorrelationId); //todo db boardId unhardcode
                //todo db handle event on frontend
                await _publisher.Publish(stickerColorChangedEvent, PublishStrategy.ParallelNoWait);
            }
        }

    }
}