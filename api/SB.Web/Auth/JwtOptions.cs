namespace SB.Web.Auth
{
    public class JwtOptions
    {
        public static readonly string SectionName = "Authentication:Jwt";

        public string Secret { get; set; }
        public string EmailEncryptionSecret { get; set; }
        public string Issuer { get; set; }
        public string Audience { get; set; }
    }
}