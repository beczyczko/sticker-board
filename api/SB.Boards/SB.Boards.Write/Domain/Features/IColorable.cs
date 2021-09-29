using SB.Boards.Common.Domain;
using SB.Boards.Write.Commands.ChangeElementColor;

namespace SB.Boards.Write.Domain.Features
{
    internal interface IColorable
    {
        public Color Color { get; }

        void ChangeColor(ChangeElementColorCommand command);
    }
}