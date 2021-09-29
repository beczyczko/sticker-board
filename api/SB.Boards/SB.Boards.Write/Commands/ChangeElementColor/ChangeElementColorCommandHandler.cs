using System.Threading.Tasks;
using JetBrains.Annotations;
using SB.Boards.Write.Domain;
using SB.Boards.Write.Domain.Features;
using SB.Boards.Write.Events;
using SB.Common.Handlers;
using SB.Common.MediatR;
using SB.Common.Mongo;

namespace SB.Boards.Write.Commands.ChangeElementColor
{
    [UsedImplicitly]
    internal class ChangeElementColorCommandHandler : ICommandHandler<ChangeElementColorCommand>
    {
        private readonly IMongoRepository<Element> _repository;
        private readonly Publisher _publisher;

        public ChangeElementColorCommandHandler(IMongoRepository<Element> repository, Publisher publisher)
        {
            _repository = repository;
            _publisher = publisher;
        }

        public async Task HandleAsync(ChangeElementColorCommand command)
        {
            var element = (await _repository.GetAsync(command.ElementId)).Value;

            var colorable = (IColorable)element;
            colorable.ChangeColor(command);

            await _repository.UpdateAsync(element);

            var stickerColorChangedEvent =
                new StickerColorChangedEvent("testId", element.Id, command.NewColor, command.CorrelationId); //todo db boardId unhardcode
            await _publisher.Publish(stickerColorChangedEvent, PublishStrategy.ParallelNoWait);
        }
    }
}