using DoggoApi.Entities;

namespace DoggoApi.Repositories
{
    public interface IDoggoRepository
    {
        DoggoEntity GetSingle(string id);
        void Add(DoggoEntity item);
        void Delete(string id);
        DoggoEntity Update(DoggoEntity item);
        IQueryable<DoggoEntity> GetAll();
        int Count();
        bool Save();
    }
}
