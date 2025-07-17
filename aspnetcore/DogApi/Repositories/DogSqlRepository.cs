using DogApi.Entities;
using DogApi.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DogApi.Repositories
{
    public class DogSqlRepository : IDogRepository
    {
        private readonly DogDbContext _dbContext;

        public DogSqlRepository(DogDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public DogEntity? GetSingle(Guid id)
        {
            return _dbContext.Dogs.FirstOrDefault(x => x.Id == id.ToString());
        }

        public void Add(DogEntity item)
        {
            _dbContext.Dogs.Add(item);
        }

        public void Delete(Guid id)
        {
            DogEntity item = GetSingle(id);
            _dbContext.Dogs.Remove(item);
        }

        public DogEntity Update(DogEntity item)
        {
            item.Id = item.Id.ToString();
            _dbContext.Dogs.Update(item);
            return item;
        }

        public IQueryable<DogEntity> GetAll()
        {
            return _dbContext.Dogs;
        }

        public IQueryable<DogEntity> GetAllForUser(string userId)
        {
            return _dbContext.Dogs.Where(x => x.UserId == userId);
        }

        public int Count()
        {
            return _dbContext.Dogs.Count();
        }

        public bool Save()
        {
            return (_dbContext.SaveChanges() >= 0);
        }
    }
}
