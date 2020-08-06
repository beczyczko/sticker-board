namespace SB.Auth
{
    public class SbApiAuthToken
    {
        public string Token { get; }

        public SbApiAuthToken(string token)
        {
            Token = token;
        }
    }
}