using System.Threading.Tasks;
using JetBrains.Annotations;
using SB.Boards.Write.Domain;
using SB.Boards.Write.Events;
using SB.Common.Handlers;
using SB.Common.MediatR;
using SB.Common.Mongo;

namespace SB.Boards.Write.Commands.RemoveElement
{
    [UsedImplicitly]
    internal class RemoveElementCommandHandler : ICommandHandler<RemoveElementCommand>
    {
        private readonly IMongoRepository<Element> _repository;
        private readonly Publisher _publisher;

        public RemoveElementCommandHandler(IMongoRepository<Element> repository, Publisher publisher)
        {
            _repository = repository;
            _publisher = publisher;
        }

        public async Task HandleAsync(RemoveElementCommand command)
        {
            var element = (await _repository.GetAsync(command.ElementId)).Value;
            element.Remove(command);
            await _repository.UpdateAsync(element);

            var elementRemovedEvent =
                new ElementRemovedEvent("testId", element.Id, command.CorrelationId); //todo db boardId unhardcode
            await _publisher.Publish(elementRemovedEvent, PublishStrategy.ParallelNoWait);
        }
    }
}