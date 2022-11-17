using DoggoApi.Entities;
using DoggoApi.Repositories;

namespace DoggoApi.Services
{
    public class SeedDataService : ISeedDataService
    {
        public void Initialize(DoggoDbContext context)
        {
            context.Database.EnsureCreated();

            if (context.Doggos.Any())
            {
                return;
            }

            context.Doggos.Add(new DoggoEntity() 
                { 
                    ImageUrl = "https://offeringsolutionscdn.blob.core.windows.net/doggos/signal-2022-11-13-084404_007.jpg", 
                    Breed = "Golden Retriever", 
                    Comment = "Goodest Boi", 
                    Id = Guid.NewGuid().ToString(), 
                    Name = "Winston", 
                    RatingCount = 1, 
                    RatingSum = 5, 
                    Created = DateTime.UtcNow,
                    UserId = "auth0|636fa1daf2a83ac5dee785d1"
                });

            context.Doggos.Add(new DoggoEntity() 
                { 
                    ImageUrl = "https://offeringsolutionscdn.blob.core.windows.net/doggos/signal-2022-11-13-084404_007.jpg", 
                    Breed = "Golden Retriever", 
                    Comment = "Goodest Boi", 
                    Id = Guid.NewGuid().ToString(), 
                    Name = "Winston", 
                    RatingCount = 1, 
                    RatingSum = 5, 
                    Created = DateTime.UtcNow,
                    UserId = "auth0|636fa1daf2a83ac5dee785d1"
                });

            context.SaveChanges();
        }
    }
}
