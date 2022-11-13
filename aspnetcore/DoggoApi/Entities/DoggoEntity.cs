namespace DoggoApi.Entities
{
    public class DoggoEntity
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Breed { get; set; }
        public string Comment { get; set; }
        public string ImageUrl { get; set; }
        public int RatingSum { get; set; }
        public int RatingCount { get; set; }
        public DateTime Created { get; set; }
        public string UserId { get; set; }
    }
}
