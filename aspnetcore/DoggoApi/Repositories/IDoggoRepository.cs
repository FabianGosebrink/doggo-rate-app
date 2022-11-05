using DoggoApi.Entities;

namespace DoggoApi.Repositories
{
    public interface IDoggoRepository
    {
        DoggoEntity? GetSingle(Guid id);
        void Add(DoggoEntity item);
        void Delete(Guid id);
        DoggoEntity Update(DoggoEntity item);
        IQueryable<DoggoEntity> GetAll();
        int Count();
        bool Save();
    }
}
