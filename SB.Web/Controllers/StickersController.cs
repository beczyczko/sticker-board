using System.Collections.Immutable;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SB.Boards.Commands.AddSticker;
using SB.Boards.Queries.Stickers;
using SB.Common.Dispatchers;

namespace SB.Web.Controllers
{
    public class StickersController : BaseController
    {
        public StickersController(IDispatcher dispatcher) : base(dispatcher)
        {
        }

        [HttpGet]
        public async Task<ActionResult<IImmutableList<StickerDto>>> Get()
        {
            var stickers = await QueryAsync(new StickersQuery());
            return Ok(stickers);
        }

        [HttpPost]
        public async Task Create([FromBody] AddStickerCommand command)
        {
            await SendAsync(command);
        }
    }
}
