using System.Threading.Tasks;
using JetBrains.Annotations;
using SB.Boards.Write.Domain;
using SB.Boards.Write.Events;
using SB.Common.Handlers;
using SB.Common.MediatR;
using SB.Common.Mongo;

namespace SB.Boards.Write.Commands.MoveElement
{
    [UsedImplicitly]
    internal class MoveElementCommandHandler : ICommandHandler<MoveElementCommand>
    {
        private readonly IMongoRepository<Element> _repository;
        private readonly Publisher _publisher;

        public MoveElementCommandHandler(IMongoRepository<Element> repository, Publisher publisher)
        {
            _repository = repository;
            _publisher = publisher;
        }

        public async Task HandleAsync(MoveElementCommand command)
        {
            var element = (await _repository.GetAsync(command.ElementId)).Value;

            element.Move(command);

            await _repository.UpdateAsync(element);

            var stickerMovedEvent =
                new ElementMovedEvent(
                    "testId", //todo db boardId unhardcode
                    element.Id,
                    element.CenterAnchor.Position);
            await _publisher.Publish(stickerMovedEvent, PublishStrategy.ParallelNoWait);
        }
    }
}