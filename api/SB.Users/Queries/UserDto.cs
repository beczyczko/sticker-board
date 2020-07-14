using System;

namespace SB.Users.Queries
{
    public class UserDto
    {
        public UserDto(Guid id, string email)
        {
            Id = id;
            Email = email;
        }

        public Guid Id { get; }
        public string Email { get; }
    }
}