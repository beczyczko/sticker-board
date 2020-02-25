using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using SB.Common.Dispatchers;

namespace SB.Web.Controllers
{
    public class TestController : BaseController
    {
        public TestController(IDispatcher dispatcher) : base(dispatcher)
        {
        }

        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new[] { "test1", "test2" };
        }
    }
}
