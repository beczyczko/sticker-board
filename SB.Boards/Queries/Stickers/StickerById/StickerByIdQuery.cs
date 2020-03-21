using System;
using CSharpFunctionalExtensions;
using SB.Common.Types;

namespace SB.Boards.Queries.Stickers.StickerById
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