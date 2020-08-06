using Google.Apis.Auth;

namespace SB.Auth
{
    public class AuthTokenPayload
    {
        public AuthTokenPayload(GoogleJsonWebSignature.Payload payload)
        {
            Email = payload.Email;
            Subject = payload.Subject;
            Issuer = payload.Issuer;
        }

        public string Email { get; }
        public string Subject { get; }
        public string Issuer { get; }
    }
}