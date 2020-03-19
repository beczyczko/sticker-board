using System.Threading;
using System.Threading.Tasks;
using JetBrains.Annotations;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using SB.Boards.Events;

namespace SB.SignalR.Board
{
    [UsedImplicitly]
    public class StickerMovedEventNotificationHandler : INotificationHandler<StickerMovedEvent>
    {
        private readonly IHubContext<BoardHub, IBoardHub> _hub;

        public StickerMovedEventNotificationHandler(IHubContext<BoardHub, IBoardHub> hub)
        {
            _hub = hub;
        }

        public async Task Handle(StickerMovedEvent notification, CancellationToken cancellationToken)
        {
            await _hub.Clients.Groups(notification.BoardId).StickerMoved(notification);
        }
    }
}