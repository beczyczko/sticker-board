using System.Threading.Tasks;
using SB.Users.Queries;

namespace SB.Auth
{
    public interface IAuthService
    {
        Task<UserDto> Authenticate(AuthTokenPayload payload);
    }
}