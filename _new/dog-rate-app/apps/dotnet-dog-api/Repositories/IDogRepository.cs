using DogApi.Entities;

namespace DogApi.Repositories
{
    public interface IDogRepository
    {
        DogEntity? GetSingle(Guid id);
        void Add(DogEntity item);
        void Delete(Guid id);
        DogEntity Update(DogEntity item);
        IQueryable<DogEntity> GetAll();
        IQueryable<DogEntity> GetAllForUser(string userId);
        int Count();
        bool Save();
    }
}
