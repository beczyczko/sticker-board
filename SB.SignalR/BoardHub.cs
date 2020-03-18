using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace SB.SignalR
{
    public class BoardHub : Hub
    {
        public async Task JoinBoardGroup(string boardId)
        {
            var contextConnectionId = Context.ConnectionId;
            await Groups.AddToGroupAsync(contextConnectionId, boardId);
        }

        public async Task LeaveBoardGroup(string boardId)
        {
            var contextConnectionId = Context.ConnectionId;
            await Groups.RemoveFromGroupAsync(contextConnectionId, boardId);
        }
    }
}