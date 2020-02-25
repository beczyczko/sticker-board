using System.Threading.Tasks;
using SB.Common.Messages;

namespace SB.Common.Handlers
{
    public interface ICommandHandler<in TCommand> where TCommand : ICommand
    {
        Task HandleAsync(TCommand command);
    }
}