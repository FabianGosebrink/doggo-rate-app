using DoggoApi.Entities;
using DoggoApi.Repositories;

namespace DoggoApi.Services
{
    public class SeedDataService : ISeedDataService
    {
        public void Initialize(DoggoDbContext context)
        {
            context.Database.EnsureCreated();

            context.Doggos.Add(new DoggoEntity() { ImageUrl = "some-image-url", Breed = "Golden Retriever", Comment = "Comment", Id = Guid.NewGuid().ToString(), Name = "Winston", RatingCount = 1, RatingSum = 5, Created = DateTime.Now });

            context.SaveChanges();
        }
    }
}
