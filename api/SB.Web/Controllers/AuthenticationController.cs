using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Mvc;

namespace SB.Web.Controllers
{
    [ApiController]
    [Route("auth")] //todo db make it api/[controller] like in every controller?
    public class AuthenticationController : ControllerBase
    {

        [Route("signin-google")]
        public IActionResult Signin(string returnUrl)
        {
            return new ChallengeResult(
                GoogleDefaults.AuthenticationScheme,
                new AuthenticationProperties
                {
                    RedirectUri = Url.Action(nameof(GoogleCallback), new { returnUrl })
                });
        }


        [Route("signin-callback")]
        public async Task<IActionResult> GoogleCallback(string returnUrl)
        {
            //todo db save logged in user
            return Redirect("/");
        }

        //todo db use user access token to api authorization

        //todo db if not logged in redirect to login page
        //todo db redirect to returnUrl after login
        //todo db prepare basic login page with information that only google auth is available and create there LoginWithGoogle button
    }
}