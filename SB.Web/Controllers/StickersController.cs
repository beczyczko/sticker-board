using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SB.Boards.Commands.AddSticker;
using SB.Boards.Commands.MoveSticker;
using SB.Boards.Domain;
using SB.Boards.Dtos;
using SB.Boards.Queries.Stickers;
using SB.Boards.Queries.Stickers.StickerById;
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

        [HttpGet("{stickerId}")]
        public async Task<ActionResult<StickerDto>> Single(Guid stickerId)
        {
            var sticker = await QueryAsync(new StickerByIdQuery(stickerId));
            return Single(sticker);
        }

        [HttpPost]
        public async Task Create(AddStickerCommand command)
        {
            await SendAsync(command);
        }

        [HttpPost("{stickerId}/[Action]")]
        public async Task Move(Guid stickerId, PositionDto newPosition)
        {
            await SendAsync(new MoveStickerCommand(stickerId, newPosition));
        }

        [HttpGet("[Action]")]
        public async Task<ActionResult<IEnumerable<ColorDto>>> Colors()
        {
            return Collection(Color.DefaultColors.Select(c => new ColorDto(c.Red, c.Green, c.Blue)));
        }
    }
}