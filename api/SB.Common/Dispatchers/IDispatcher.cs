using System.Threading.Tasks;
using SB.Common.Messages;
using SB.Common.Types;

namespace SB.Common.Dispatchers
{
    public interface IDispatcher
    {
        Task SendAsync<TCommand>(TCommand command) where TCommand : ICommand;
        Task<TResult> QueryAsync<TResult>(IQuery<TResult> query);
    }
}