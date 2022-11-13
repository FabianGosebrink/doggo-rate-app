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

        public DoggoEntity? GetSingle(Guid id)
        {
            return _dbContext.Doggos.FirstOrDefault(x => x.Id == id.ToString());
        }

        public void Add(DoggoEntity item)
        {
            _dbContext.Doggos.Add(item);
        }

        public void Delete(Guid id)
        {
            DoggoEntity foodItem = GetSingle(id);
            _dbContext.Doggos.Remove(foodItem);
        }

        public DoggoEntity Update(DoggoEntity item)
        {
            item.Id = item.Id.ToString();
            _dbContext.Doggos.Update(item);
            return item;
        }

        public IQueryable<DoggoEntity> GetAll()
        {
            return _dbContext.Doggos;
        }

        public IQueryable<DoggoEntity> GetAllForUser(string userId)
        {
            return _dbContext.Doggos.Where(x => x.UserId == userId);
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
