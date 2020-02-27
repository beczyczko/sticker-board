using System.Threading.Tasks;
using SB.Common.Types;

namespace SB.Common.Dispatchers
{
    public interface IQueryDispatcher
    {
        Task<TResult> QueryAsync<TResult>(IQuery<TResult> query);
    }
}