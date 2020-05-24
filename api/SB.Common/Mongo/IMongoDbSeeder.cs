using System.Threading.Tasks;

namespace SB.Common.Mongo
{
    public interface IMongoDbSeeder
    {
        Task SeedAsync();
    }
}