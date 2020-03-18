using System.Threading.Tasks;
using JetBrains.Annotations;
using Microsoft.AspNetCore.SignalR;
using SB.Boards.Domain;
using SB.Boards.Events;
using SB.Boards.Queries.Stickers;
using SB.Common.Handlers;
using SB.Common.Mongo;
using SB.SignalR;

namespace SB.Boards.Commands.MoveSticker
{
    [UsedImplicitly]
    internal class MoveStickerCommandHandler : ICommandHandler<MoveStickerCommand>
    {
        private readonly IHubContext<BoardHub> _hub;
        private readonly IMongoRepository<Sticker> _repository;

        public MoveStickerCommandHandler(IMongoRepository<Sticker> repository, IHubContext<BoardHub> hub)
        {
            _repository = repository;
            _hub = hub;
        }

        public async Task HandleAsync(MoveStickerCommand command)
        {
            var sticker = (await _repository.GetAsync(command.StickerId)).Value;
            sticker.Move(command);
            await _repository.UpdateAsync(sticker);

            // todo db use mediatr to handle events
            var stickerMovedEvent =
                new StickerMovedEvent(sticker.Id, new PositionDto(sticker.Position.X, sticker.Position.Y));
            await _hub.Clients.Groups("testId").SendAsync("StickerMoved", stickerMovedEvent);
        }
    }
}