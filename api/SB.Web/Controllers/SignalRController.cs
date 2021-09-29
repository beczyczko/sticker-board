using Microsoft.AspNetCore.Mvc;
using SB.Boards.Write.Events;

namespace SB.Web.Controllers
{
    public class SignalRController : ControllerBase
    {
        [HttpGet("[Action]")]
        public ActionResult<EventsTypes> Types()
        {
            return Ok();
        }

        public class EventsTypes
        {
            public ElementColorChangedEvent ElementColorChangedEvent { get; }
            public ElementMovedEvent ElementMovedEvent { get; }
            public ElementRemovedEvent ElementRemovedEvent { get; }
            public ElementTextChangedEvent ElementTextChangedEvent { get; }
            public StickerCreatedEvent StickerCreatedEvent { get; }
        }
    }
}