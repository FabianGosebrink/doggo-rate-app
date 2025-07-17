using DogApi.Entities;
using Microsoft.EntityFrameworkCore;

namespace DogApi.Repositories
{
    public class DogDbContext : DbContext
    {
        public DogDbContext(DbContextOptions<DogDbContext> options)
            : base(options)
        {
        }

        public DbSet<DogEntity> Dogs { get; set; } = null!;


        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<DogEntity>().HasKey(m => m.Id);

            base.OnModelCreating(builder);
        }
    }
}
