using DoggoApi.Entities;
using DoggoApi.Repositories;

namespace DoggoApi.Services
{
    public class SeedDataService : ISeedDataService
    {
        public void Initialize(DoggoDbContext context)
        {
            context.Doggos.Add(new DoggoEntity() { ImageUrl = "some-image-url", Breed = "Golden Retriever", Comment = "Comment", Id = "some-id", Name = "Winston", RatingCount = 1, RatingSum = 5, Created = DateTime.Now });

            context.SaveChanges();
        }
    }
}
