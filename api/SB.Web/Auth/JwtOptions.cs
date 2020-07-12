namespace SB.Web.Auth
{
    public class JwtOptions
    {
        public static readonly string SectionName = "Authentication:Jwt";

        public string Secret { get; set; }
        public string EmailEncryptionSecret { get; set; }
    }
}