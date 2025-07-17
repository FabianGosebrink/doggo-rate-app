using DogApi.Repositories;

namespace DogApi.Services
{
    public interface ISeedDataService
    {
        void Initialize(DogDbContext context);
    }
}
