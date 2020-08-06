using System.Threading.Tasks;
using CSharpFunctionalExtensions;

namespace SB.Auth.ExternalAuthProviders
{
    public interface IGoogleAuthenticator
    {
        Task<Result<SbApiAuthToken>> AuthenticateAsync(GoogleAuthToken googleAuthToken);
    }
}