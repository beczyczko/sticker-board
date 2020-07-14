using System.Threading.Tasks;
using Google.Apis.Auth;
using SB.Users.Queries;

namespace SB.Auth
{
    public interface IAuthService
    {
        Task<UserDto> Authenticate(GoogleJsonWebSignature.Payload payload);
    }
}