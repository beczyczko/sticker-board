using System.Threading.Tasks;
using SB.Common.Messages;

namespace SB.Common.Dispatchers
{
    public interface ICommandDispatcher
    {
         Task SendAsync<T>(T command) where T : ICommand;
    }
}