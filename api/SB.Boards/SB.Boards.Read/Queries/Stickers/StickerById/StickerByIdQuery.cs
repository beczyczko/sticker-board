using System;
using CSharpFunctionalExtensions;
using SB.Boards.Common.Dtos;
using SB.Common.Types;

namespace SB.Boards.Read.Queries.Stickers.StickerById
{
    public class StickerByIdQuery : IQuery<Maybe<StickerDto>>
    {
        public StickerByIdQuery(Guid stickerId)
        {
            StickerId = stickerId;
        }

        public Guid StickerId { get; }
    }
}