using DoggoApi.Entities;
using DoggoApi.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DoggoApi.Repositories
{
    public class DoggoSqlRepository : IDoggoRepository
    {
        private readonly DoggoDbContext _dbContext;

        public DoggoSqlRepository(DoggoDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public DoggoEntity GetSingle(string id)
        {
            return _dbContext.Doggos.FirstOrDefault(x => x.Id == id);
        }

        public void Add(DoggoEntity item)
        {
            _dbContext.Doggos.Add(item);
        }

        public void Delete(string id)
        {
            DoggoEntity foodItem = GetSingle(id);
            _dbContext.Doggos.Remove(foodItem);
        }

        public DoggoEntity Update(DoggoEntity item)
        {
            _dbContext.Doggos.Update(item);
            return item;
        }

        public IQueryable<DoggoEntity> GetAll()
        {
            return _dbContext.Doggos;
        }

        public int Count()
        {
            return _dbContext.Doggos.Count();
        }

        public bool Save()
        {
            return (_dbContext.SaveChanges() >= 0);
        }
    }
}
