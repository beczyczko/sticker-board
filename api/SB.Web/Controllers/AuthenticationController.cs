using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using SB.Auth;
using SB.Auth.ExternalAuthProviders;
using SB.Common;
using SB.Web.Auth;

namespace SB.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class AuthenticationController : ControllerBase
    {
        //todo db clean everything
        private readonly ILogger<AuthenticationController> _logger;

        private readonly IAuthService _authService;

        private readonly IConfiguration _configuration;
        //todo db use user access token to api authorization

        //todo db if not logged in redirect to login page
        //todo db redirect to returnUrl after login
        //todo db prepare basic login page with information that only google auth is available and create there LoginWithGoogle button
        public AuthenticationController(
            ILogger<AuthenticationController> logger,
            IAuthService authService,
            IConfiguration configuration)
        {
            _logger = logger;
            _authService = authService;
            _configuration = configuration;
        }

        [HttpGet]
        public IActionResult IsAuthenticated()
        {
            return Ok();
        }

        [AllowAnonymous]
        [HttpPost("[Action]")]
        public async Task<IActionResult> Google([FromBody] GoogleAuthToken googleAuthToken)
        {
            var authJwtOptions = _configuration.GetOptions<JwtOptions>(JwtOptions.SectionName);
            var jwtEmailEncryptionSecret = authJwtOptions.EmailEncryptionSecret;
            var jwtSecret = authJwtOptions.Secret;

            var authGoogleOptions = _configuration.GetOptions<GoogleAuthOptions>(GoogleAuthOptions.SectionName);

            //todo db introduce GoogleAuthenticator
            try
            {
                var payload = GoogleJsonWebSignature
                    .ValidateAsync(googleAuthToken.IdToken, new GoogleJsonWebSignature.ValidationSettings()
                    {
                        Audience = new[] { authGoogleOptions.ClientId },
                    }).Result;
                var user = await _authService.Authenticate(payload);

                var claims = new[]
                {
                    new Claim(JwtRegisteredClaimNames.Sub, jwtEmailEncryptionSecret, user.Id.ToString()),
                    new Claim(JwtRegisteredClaimNames.Email, Security.Encrypt(jwtEmailEncryptionSecret, user.Email)),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                };

                var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtSecret));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    authJwtOptions.Issuer,
                    authJwtOptions.Audience,
                    claims,
                    expires: DateTime.Now.AddSeconds(55 * 60),
                    signingCredentials: creds);
                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token)
                });
            }
            catch (Exception ex)
            {
                //todo db
                // Helpers.SimpleLogger.Log(ex);
                BadRequest(ex.Message);
            }

            return BadRequest();
        }
    }
}