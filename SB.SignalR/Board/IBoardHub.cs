using System.Threading.Tasks;
using SB.Boards.Events;

namespace SB.SignalR.Board
{
    public interface IBoardHub
    {
        Task StickerMoved(StickerMovedEvent @event);
        Task StickerCreated(StickerCreatedEvent @event);
    }
}