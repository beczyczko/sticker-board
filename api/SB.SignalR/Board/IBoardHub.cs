using System.Threading.Tasks;
using SB.Boards.Write.Events;

namespace SB.SignalR.Board
{
    public interface IBoardHub
    {
        Task ElementMoved(ElementMovedEvent @event);
        Task ElementTextChanged(ElementTextChangedEvent @event);
        Task ElementColorChanged(ElementColorChangedEvent @event);
        Task StickerCreated(StickerCreatedEvent @event);
        Task ElementRemoved(ElementRemovedEvent @event);
    }
}