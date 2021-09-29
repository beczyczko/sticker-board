using System.Threading.Tasks;
using JetBrains.Annotations;
using SB.Boards.Write.Domain;
using SB.Boards.Write.Domain.Features;
using SB.Boards.Write.Events;
using SB.Common.Handlers;
using SB.Common.MediatR;
using SB.Common.Mongo;

namespace SB.Boards.Write.Commands.ChangeElementText
{
    [UsedImplicitly]
    internal class ChangeElementTextCommandHandler : ICommandHandler<ChangeElementTextCommand>
    {
        private readonly IMongoRepository<Element> _repository;
        private readonly Publisher _publisher;

        public ChangeElementTextCommandHandler(IMongoRepository<Element> repository, Publisher publisher)
        {
            _repository = repository;
            _publisher = publisher;
        }

        public async Task HandleAsync(ChangeElementTextCommand command)
        {
            var element = (await _repository.GetAsync(command.ElementId)).Value;

            var textable = (ITextable)element;
            textable.ChangeText(command);

            await _repository.UpdateAsync(element);

            var stickerTextChangedEvent =
                new StickerTextChangedEvent("testId", element.Id, textable.Text, command.CorrelationId); //todo db boardId unhardcode
            await _publisher.Publish(stickerTextChangedEvent, PublishStrategy.ParallelNoWait);
        }
    }
}