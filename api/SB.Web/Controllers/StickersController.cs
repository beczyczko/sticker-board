using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using NSwag.Annotations;
using SB.Boards.Common.Dtos;
using SB.Boards.Read.Queries.Stickers;
using SB.Boards.Read.Queries.Stickers.StickerById;
using SB.Boards.Write.Commands.AddSticker;
using SB.Boards.Write.Commands.ChangeElementColor;
using SB.Boards.Write.Commands.ChangeElementText;
using SB.Boards.Write.Commands.MoveElement;
using SB.Boards.Write.Commands.RemoveElement;
using SB.Common.Dispatchers;
using SB.Common.Types;

namespace SB.Web.Controllers
{
    //todo db rename to ElementsController, fix every name related to Sticker
    public class StickersController : BaseController
    {
        public StickersController(IDispatcher dispatcher) : base(dispatcher)
        {
        }

        [HttpGet]
        public async Task<ActionResult<IImmutableList<Boards.Read.Domain.Element>>> Stickers()
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
        public async Task Position(Guid stickerId, SbVector2 newPosition)
        {
            await SendAsync(new MoveElementCommand(stickerId, newPosition));
        }

        [HttpPost("{stickerId}/[Action]")]
        [SwaggerResponse(HttpStatusCode.Accepted, typeof(void))]
        public async Task<ActionResult> Text(Guid stickerId, string newText, Guid correlationId)
        {
            //todo db find out how to pass correlationId in a proper way

            //todo db if method argument newText was object this null check would not be needed?
            newText ??= string.Empty;

            await SendAsync(new ChangeElementTextCommand(stickerId, newText, correlationId));
            return Accepted();
        }

        [HttpPost("{stickerId}/[Action]")]
        [SwaggerResponse(HttpStatusCode.Accepted, typeof(void))]
        public async Task<ActionResult> Color(Guid stickerId, ColorDto newColor, Guid correlationId)
        {
            //todo db find out how to pass correlationId in a proper way
            await SendAsync(new ChangeElementColorCommand(stickerId, newColor, correlationId));
            return Accepted();
        }

        [HttpDelete("{stickerId}/[Action]")]
        [SwaggerResponse(HttpStatusCode.Accepted, typeof(void))]
        public async Task<ActionResult> Remove(Guid stickerId, DateTimeOffset commandMoment, Guid correlationId)
        {
            //todo db find out how to pass correlationId in a proper way
            await SendAsync(new RemoveElementCommand(stickerId, commandMoment, correlationId));
            return Accepted();
        }

        [HttpGet("[Action]")]
        public ActionResult<IEnumerable<ColorDto>> Colors()
        {
            return Collection(SB.Boards.Common.Domain.Color.DefaultColors.Select(c => new ColorDto(c.Red, c.Green, c.Blue)));
        }

        [HttpGet("[Action]")]
        public ActionResult<ElementTypes> Types()
        {
            return Ok();
        }

        public class ElementTypes
        {
            public Boards.Read.Domain.Sticker Sticker { get; }
            public Boards.Read.Domain.Connection Connection { get; }
        }
    }
}