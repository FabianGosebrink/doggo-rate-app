using DoggoApi.Repositories;

namespace DoggoApi.Services
{
    public interface ISeedDataService
    {
        void Initialize(DoggoDbContext context);
    }
}
