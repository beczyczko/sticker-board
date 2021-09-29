using SB.Boards.Write.Commands.ChangeElementText;

namespace SB.Boards.Write.Domain.Features
{
    internal interface ITextable
    {
        public string Text { get; }
        public void ChangeText(ChangeElementTextCommand command);
    }
}