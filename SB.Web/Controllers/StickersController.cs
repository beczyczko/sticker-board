using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SB.Boards.Commands.AddSticker;
using SB.Common.Dispatchers;

namespace SB.Web.Controllers
{
    public class StickersController : BaseController
    {
        public StickersController(IDispatcher dispatcher) : base(dispatcher)
        {
        }

        [HttpGet]
        public async Task Get()
        {
            
        }

        [HttpPost]
        public async Task Create([FromBody] AddStickerCommand command)
        {
            await SendAsync(command);
        }
    }
}
