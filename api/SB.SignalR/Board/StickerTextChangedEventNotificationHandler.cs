using System.Threading;
using System.Threading.Tasks;
using JetBrains.Annotations;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using SB.Boards.Write.Events;

namespace SB.SignalR.Board
{
    [UsedImplicitly]
    public class StickerTextChangedEventNotificationHandler : INotificationHandler<ElementTextChangedEvent>
    {
        private readonly IHubContext<BoardHub, IBoardHub> _hub;

        public StickerTextChangedEventNotificationHandler(IHubContext<BoardHub, IBoardHub> hub)
        {
            _hub = hub;
        }

        public async Task Handle(ElementTextChangedEvent notification, CancellationToken cancellationToken)
        {
            await _hub.Clients.Groups(notification.BoardId).ElementTextChanged(notification);
        }
    }
}