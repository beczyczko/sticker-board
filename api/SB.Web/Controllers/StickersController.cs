using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NSwag.Annotations;
using SB.Boards.Commands.AddSticker;
using SB.Boards.Commands.ChangeStickerColor;
using SB.Boards.Commands.ChangeStickerText;
using SB.Boards.Commands.MoveSticker;
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
        public async Task<ActionResult<IImmutableList<StickerDto>>> Stickers()
        {
            var stickers = await QueryAsync(new StickersQuery());
            return Ok(stickers);
        }

        [HttpGet("{stickerId}")]
        public async Task<ActionResult<StickerDto>> Sticker(Guid stickerId)
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
        public async Task Position(Guid stickerId, PositionDto newPosition)
        {
            await SendAsync(new MoveStickerCommand(stickerId, newPosition));
        }

        [HttpPost("{stickerId}/[Action]")]
        [SwaggerResponse(HttpStatusCode.Accepted, typeof(void))]
        public async Task<ActionResult> Text(Guid stickerId, string newText, Guid correlationId)
        {
            //todo db find out how to pass correlationId in a proper way
            await SendAsync(new ChangeStickerTextCommand(stickerId, newText, correlationId));
            return Accepted();
        }

        [HttpPost("{stickerId}/[Action]")]
        [SwaggerResponse(HttpStatusCode.Accepted, typeof(void))]
        public async Task<ActionResult> Color(Guid stickerId, ColorDto newColor, Guid correlationId)
        {
            //todo db find out how to pass correlationId in a proper way
            await SendAsync(new ChangeStickerColorCommand(stickerId, newColor, correlationId));
            return Accepted();
        }

        [HttpGet("[Action]")]
        public ActionResult<IEnumerable<ColorDto>> Colors()
        {
            return Collection(Boards.Domain.Color.DefaultColors.Select(c => new ColorDto(c.Red, c.Green, c.Blue)));
        }
    }
}