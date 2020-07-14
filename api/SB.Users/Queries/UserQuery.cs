using System.Threading.Tasks;
using CSharpFunctionalExtensions;
using JetBrains.Annotations;
using SB.Common.Handlers;
using SB.Common.Mongo;
using SB.Common.Types;
using SB.Users.Domain;

namespace SB.Users.Queries
{
    public class UserQuery : IQuery<Maybe<UserDto>>
    {
        public UserQuery(string email)
        {
            Email = email;
        }

        public string Email { get; private set; }

        [UsedImplicitly]
        internal class UserQueryHandler : IQueryHandler<UserQuery, Maybe<UserDto>>
        {
            private readonly IMongoRepository<User> _repository;

            public UserQueryHandler(IMongoRepository<User> repository)
            {
                _repository = repository;
            }

            public async Task<Maybe<UserDto>> HandleAsync(UserQuery query)
            {
                var maybeUser = await _repository.GetAsync(u => u.Email == query.Email);
                return maybeUser.Select(u => new UserDto(u.Id, u.Email));
            }
        }
    }
}