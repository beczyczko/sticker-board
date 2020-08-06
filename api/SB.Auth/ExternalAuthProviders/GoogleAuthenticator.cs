using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using CSharpFunctionalExtensions;
using Google.Apis.Auth;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using SB.Common;

namespace SB.Auth.ExternalAuthProviders
{
    public class GoogleAuthenticator : IGoogleAuthenticator
    {
        private readonly IConfiguration _configuration;
        private readonly IAuthService _authService;
        private readonly ILogger<GoogleAuthenticator> _logger;

        public GoogleAuthenticator(
            IConfiguration configuration,
            IAuthService authService,
            ILogger<GoogleAuthenticator> logger)
        {
            _configuration = configuration;
            _authService = authService;
            _logger = logger;
        }

        public async Task<Result<SbApiAuthToken>> AuthenticateAsync(GoogleAuthToken googleAuthToken)
        {
            var payload = await ValidateAsync(googleAuthToken);
            if (payload.IsSuccess)
            {
                return await AuthenticateWithToken(new AuthTokenPayload(payload.Value));
            }
            else
            {
                return Result.Failure<SbApiAuthToken>(payload.Error);
            }
        }

        private async Task<Result<GoogleJsonWebSignature.Payload>> ValidateAsync(GoogleAuthToken googleAuthToken)
        {
            var authGoogleOptions = _configuration.GetOptions<GoogleAuthOptions>(GoogleAuthOptions.SectionName);

            try
            {
                var payload = await GoogleJsonWebSignature
                    .ValidateAsync(googleAuthToken.IdToken, new GoogleJsonWebSignature.ValidationSettings()
                    {
                        Audience = new[] { authGoogleOptions.ClientId },
                    });

                return Result.Ok(payload);
            }
            catch (Exception e)
            {
                _logger.LogWarning(e, "Google id_token validation failed");
                return Result.Failure<GoogleJsonWebSignature.Payload>(e.Message);
            }
        }

        private async Task<Result<SbApiAuthToken>> AuthenticateWithToken(AuthTokenPayload payload)
        {
            var authJwtOptions = _configuration.GetOptions<JwtOptions>(JwtOptions.SectionName);
            var jwtEmailEncryptionSecret = authJwtOptions.EmailEncryptionSecret;
            var jwtSecret = authJwtOptions.Secret;

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
                expires: DateTime.Now.AddSeconds(3600),
                signingCredentials: creds);
            return Result.Ok(new SbApiAuthToken(new JwtSecurityTokenHandler().WriteToken(token)));
        }
    }
}