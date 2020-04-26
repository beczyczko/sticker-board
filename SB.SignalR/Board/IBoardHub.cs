using System.Threading.Tasks;
using SB.Boards.Events;

namespace SB.SignalR.Board
{
    public interface IBoardHub
    {
        Task StickerMoved(StickerMovedEvent @event);
        Task StickerTextChanged(StickerTextChangedEvent @event);
        Task StickerColorChanged(StickerColorChangedEvent @event);
        Task StickerCreated(StickerCreatedEvent @event);
    }
}