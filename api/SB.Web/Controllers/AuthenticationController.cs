using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SB.Auth;
using SB.Auth.ExternalAuthProviders;

namespace SB.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class AuthenticationController : ControllerBase
    {
        private readonly IGoogleAuthenticator _googleAuthenticator;

        public AuthenticationController(IGoogleAuthenticator googleAuthenticator)
        {
            _googleAuthenticator = googleAuthenticator;
        }

        [HttpGet]
        public IActionResult IsAuthenticated()
        {
            return Ok();
        }

        [AllowAnonymous]
        [HttpPost("[Action]")]
        public async Task<ActionResult<SbApiAuthToken>> Google([FromBody] GoogleAuthToken googleAuthToken)
        {
            var authenticationResult = await _googleAuthenticator.AuthenticateAsync(googleAuthToken);
            if (authenticationResult.IsSuccess)
            {
                return Ok(authenticationResult.Value);
            }
            else
            {
                return BadRequest();
            }
        }
    }
}