using System.Threading.Tasks;
using JetBrains.Annotations;
using Microsoft.AspNetCore.SignalR;

namespace SB.SignalR.Board
{
    public class BoardHub : Hub<IBoardHub>
    {
        [UsedImplicitly]
        public async Task JoinBoardGroup(string boardId)
        {
            var contextConnectionId = Context.ConnectionId;
            await Groups.AddToGroupAsync(contextConnectionId, boardId);
        }

        [UsedImplicitly]
        public async Task LeaveBoardGroup(string boardId)
        {
            var contextConnectionId = Context.ConnectionId;
            await Groups.RemoveFromGroupAsync(contextConnectionId, boardId);
        }
    }
}