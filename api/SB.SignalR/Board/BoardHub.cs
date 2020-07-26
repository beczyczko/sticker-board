using System.Threading.Tasks;
using JetBrains.Annotations;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace SB.SignalR.Board
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
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