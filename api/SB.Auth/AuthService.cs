﻿using System;
using System.Threading.Tasks;
using Google.Apis.Auth;
using JetBrains.Annotations;
using SB.Common.Dispatchers;
using SB.Users.Commands;
using SB.Users.Queries;

namespace SB.Auth
{
    [UsedImplicitly]
    public class AuthService : IAuthService
    {
        private readonly IDispatcher _dispatcher;
        public AuthService(IDispatcher dispatcher)
        {
            _dispatcher = dispatcher;
        }

        public async Task<UserDto> Authenticate(GoogleJsonWebSignature.Payload payload)
        {
            //todo db this class should not depend on Google.Apis.Auth
            var userDto = await _dispatcher.QueryAsync(new UserQuery(payload.Email));
            if (userDto.HasValue)
            {
                return userDto.Value;
            }
            else
            {
                var newUser = new UserDto(Guid.NewGuid(), payload.Email);
                await _dispatcher.SendAsync(new AddUserCommand(newUser.Id, newUser.Email, payload.Subject, payload.Issuer));
                return newUser;
            }
        }
    }
}