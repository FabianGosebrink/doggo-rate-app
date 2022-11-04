using DoggoApi.Entities;
using Microsoft.EntityFrameworkCore;

namespace DoggoApi.Repositories
{
    public class DoggoDbContext : DbContext
    {
        public DoggoDbContext(DbContextOptions<DoggoDbContext> options)
            : base(options)
        {
        }

        public DbSet<DoggoEntity> Doggos { get; set; } = null!;
    }
}
