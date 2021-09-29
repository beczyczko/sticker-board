using System.Threading;
using System.Threading.Tasks;
using JetBrains.Annotations;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using SB.Boards.Write.Events;

namespace SB.SignalR.Board
{
    [UsedImplicitly]
    public class StickerCreatedEventNotificationHandler : INotificationHandler<StickerCreatedEvent>
    {
        private readonly IHubContext<BoardHub, IBoardHub> _hub;

        public StickerCreatedEventNotificationHandler(IHubContext<BoardHub, IBoardHub> hub)
        {
            _hub = hub;
        }

        public async Task Handle(StickerCreatedEvent notification, CancellationToken cancellationToken)
        {
            await _hub.Clients.Groups(notification.BoardId).StickerCreated(notification);
        }
    }
}