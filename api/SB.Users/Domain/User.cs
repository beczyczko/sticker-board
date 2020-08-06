using System;
using SB.Common.Mongo;

namespace SB.Users.Domain
{
    internal class User : BaseEntity
    {
        public User(Guid id, string email, string oauthSubject, string oauthIssuer)
        {
            Id = id;
            Email = email;
            OauthSubject = oauthSubject;
            OauthIssuer = oauthIssuer;
        }

        public string Email { get; private set; }
        public string OauthSubject { get; private set; }
        public string OauthIssuer { get; private set; }
    }
}