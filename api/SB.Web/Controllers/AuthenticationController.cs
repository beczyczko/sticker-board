using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
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
        public async Task<IActionResult> IsAuthenticated()
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

            try
            {
                _logger.LogInformation("id_token = " + googleAuthToken.IdToken);
                var payload = GoogleJsonWebSignature
                    .ValidateAsync(googleAuthToken.IdToken, new GoogleJsonWebSignature.ValidationSettings()
                    {
                        Audience = new[] { authGoogleOptions.ClientId },
                    }).Result;
                var user = await _authService.Authenticate(payload);
                _logger.LogInformation(payload.ExpirationTimeSeconds.ToString());

                var claims = new[]
                {
                    new Claim(JwtRegisteredClaimNames.Sub, Security.Encrypt(jwtEmailEncryptionSecret, user.email)),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                };

                var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtSecret));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(String.Empty,
                    String.Empty,
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
                // Helpers.SimpleLogger.Log(ex);
                BadRequest(ex.Message);
            }

            return BadRequest();
        }
    }

    public interface IAuthService
    {
        Task<User> Authenticate(GoogleJsonWebSignature.Payload payload);
    }

    public class AuthService : IAuthService
    {
        public AuthService()
        {
            Refresh();
        }

        private static IList<User> _users = new List<User>();

        public async Task<User> Authenticate(GoogleJsonWebSignature.Payload payload)
        {
            await Task.Delay(1);
            return FindUserOrAdd(payload);
        }

        private User FindUserOrAdd(GoogleJsonWebSignature.Payload payload)
        {
            var u = _users.FirstOrDefault(x => x.email == payload.Email);
            if (u == null)
            {
                u = new User()
                {
                    id = Guid.NewGuid(),
                    name = payload.Name,
                    email = payload.Email,
                    oauthSubject = payload.Subject,
                    oauthIssuer = payload.Issuer
                };
                _users.Add(u);
            }

            return u;
        }

        private void Refresh()
        {
            if (_users.Count == 0)
            {
                _users.Add(new User() { id = Guid.NewGuid(), name = "Test Person1", email = "test@gmail.com" });
            }
        }
    }

    public class User
    {
        public Guid id { get; set; }
        public string name { get; set; }
        public string email { get; set; }
        public string oauthSubject { get; set; }
        public string oauthIssuer { get; set; }
    }

    public class GoogleAuthToken
    {
        public string IdToken { get; set; }
    }

    public class Security
    {
        public static string Encrypt(string key, string toEncrypt, bool useHashing = true)
        {
            byte[] resultArray = null;
            try
            {
                byte[] keyArray;
                byte[] toEncryptArray = UTF8Encoding.UTF8.GetBytes(toEncrypt);

                if (useHashing)
                {
                    using (MD5CryptoServiceProvider hashmd5 = new MD5CryptoServiceProvider())
                    {
                        keyArray = hashmd5.ComputeHash(UTF8Encoding.UTF8.GetBytes(key));
                    }
                }
                else
                    keyArray = UTF8Encoding.UTF8.GetBytes(key);


                using (TripleDESCryptoServiceProvider tdes = new TripleDESCryptoServiceProvider())
                {
                    tdes.Key = keyArray;
                    tdes.Mode = CipherMode.ECB;
                    tdes.Padding = PaddingMode.PKCS7;
                    ICryptoTransform cTransform = tdes.CreateEncryptor();
                    resultArray = cTransform.TransformFinalBlock(toEncryptArray, 0, toEncryptArray.Length);
                }
            }
            catch (Exception ex)
            {
                // SimpleLogger.Log(ex);
            }

            return Convert.ToBase64String(resultArray, 0, resultArray.Length);
        }

        public static string Decrypt(string key, string cipherString, bool useHashing = true)
        {
            byte[] resultArray = null;
            try
            {
                byte[] keyArray;
                byte[] toEncryptArray = Convert.FromBase64String(cipherString);

                if (useHashing)
                {
                    using (MD5CryptoServiceProvider hashmd5 = new MD5CryptoServiceProvider())
                    {
                        keyArray = hashmd5.ComputeHash(UTF8Encoding.UTF8.GetBytes(key));
                    }
                }
                else
                    keyArray = UTF8Encoding.UTF8.GetBytes(key);


                using (TripleDESCryptoServiceProvider tdes = new TripleDESCryptoServiceProvider())
                {
                    tdes.Key = keyArray;
                    tdes.Mode = CipherMode.ECB;
                    tdes.Padding = PaddingMode.PKCS7;

                    ICryptoTransform cTransform = tdes.CreateDecryptor();
                    resultArray = cTransform.TransformFinalBlock(toEncryptArray, 0, toEncryptArray.Length);
                }
            }
            catch (Exception ex)
            {
                // SimpleLogger.Log(ex);
            }

            return UTF8Encoding.UTF8.GetString(resultArray);
        }
    }
}