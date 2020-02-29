using System.Threading.Tasks;

namespace SB.Common
{
    public interface IInitializer
    {
        Task InitializeAsync();
    }
}