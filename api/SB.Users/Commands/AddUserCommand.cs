using System;
using System.Threading.Tasks;
using JetBrains.Annotations;
using Newtonsoft.Json;
using SB.Common.Handlers;
using SB.Common.Messages;
using SB.Common.Mongo;
using SB.Users.Domain;

namespace SB.Users.Commands
{
    public class AddUserCommand : ICommand
    {
        [JsonConstructor]
        public AddUserCommand(
            Guid id,
            string email,
            string oauthSubject,
            string oauthIssuer)
        {
            Id = id;
            Email = email;
            OauthSubject = oauthSubject;
            OauthIssuer = oauthIssuer;
        }

        public Guid Id { get; }
        public string Email { get; }
        public string OauthSubject { get; }
        public string OauthIssuer { get; }


        [UsedImplicitly]
        internal class AddUserCommandHandler : ICommandHandler<AddUserCommand>
        {
            private readonly IMongoRepository<User> _repository;

            public AddUserCommandHandler(IMongoRepository<User> repository)
            {
                _repository = repository;
            }

            public async Task HandleAsync(AddUserCommand command)
            {
                var sticker = new User(
                    command.Id,
                    command.Email,
                    command.OauthSubject,
                    command.OauthIssuer);
                await _repository.AddAsync(sticker);
            }
        }
    }
}