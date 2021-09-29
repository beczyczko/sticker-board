using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using NSwag.Annotations;
using SB.Boards.Common.Dtos;
using SB.Boards.Read.Queries.ElementById;
using SB.Boards.Read.Queries.Elements;
using SB.Boards.Write.Commands.AddSticker;
using SB.Boards.Write.Commands.ChangeElementColor;
using SB.Boards.Write.Commands.ChangeElementText;
using SB.Boards.Write.Commands.MoveElement;
using SB.Boards.Write.Commands.RemoveElement;
using SB.Common.Dispatchers;
using SB.Common.Types;

namespace SB.Web.Controllers.Elements
{
    public class ElementsController : BaseController
    {
        public ElementsController(IDispatcher dispatcher) : base(dispatcher)
        {
        }

        [HttpGet]
        public async Task<ActionResult<IImmutableList<Boards.Read.Domain.Element>>> Elements()
        {
            var elements = await QueryAsync(new ElementsQuery());
            return Ok(elements);
        }

        [HttpGet("{elementId}")]
        public async Task<ActionResult<Boards.Read.Domain.Element>> Element(Guid elementId)
        {
            var element = await QueryAsync(new ElementByIdQuery(elementId));
            return Single(element);
        }

        [HttpPost]
        public async Task Create(AddStickerCommand command)
        {
            await SendAsync(command);
        }

        [HttpPost("{elementId}/[Action]")]
        public async Task Position(Guid elementId, SbVector2 newPosition)
        {
            await SendAsync(new MoveElementCommand(elementId, newPosition));
        }

        [HttpPost("{elementId}/[Action]")]
        [SwaggerResponse(HttpStatusCode.Accepted, typeof(void))]
        public async Task<ActionResult> Text(Guid elementId, ChangeElementTextCommand command, Guid correlationId)
        {
            //todo db find out how to pass correlationId in a proper way
            var changeElementTextCommand = new Boards.Write.Commands.ChangeElementText.ChangeElementTextCommand(
                elementId,
                command.NewText,
                correlationId);

            await SendAsync(changeElementTextCommand);
            return Accepted();
        }

        [HttpPost("{elementId}/[Action]")]
        [SwaggerResponse(HttpStatusCode.Accepted, typeof(void))]
        public async Task<ActionResult> Color(Guid elementId, ColorDto newColor, Guid correlationId)
        {
            //todo db find out how to pass correlationId in a proper way
            await SendAsync(new ChangeElementColorCommand(elementId, newColor, correlationId));
            return Accepted();
        }

        [HttpDelete("{elementId}/[Action]")]
        [SwaggerResponse(HttpStatusCode.Accepted, typeof(void))]
        public async Task<ActionResult> Remove(Guid elementId, DateTimeOffset commandMoment, Guid correlationId)
        {
            //todo db find out how to pass correlationId in a proper way
            await SendAsync(new RemoveElementCommand(elementId, commandMoment, correlationId));
            return Accepted();
        }

        [HttpGet("[Action]")]
        public ActionResult<IEnumerable<ColorDto>> Colors()
        {
            return Collection(SB.Boards.Common.Domain.Color.DefaultColors.Select(c => new ColorDto(c.Red, c.Green, c.Blue)));
        }

        [HttpGet("[Action]")]
        public ActionResult<ElementsTypes> Types()
        {
            return Ok();
        }

        public class ElementsTypes
        {
            public Boards.Read.Domain.Sticker Sticker { get; }
            public Boards.Read.Domain.Connection Connection { get; }
        }
    }
}