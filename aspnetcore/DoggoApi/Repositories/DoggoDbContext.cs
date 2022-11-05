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


        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<DoggoEntity>().HasKey(m => m.Id);

            base.OnModelCreating(builder);
        }
    }
}
