namespace DogApi.Dtos
{
    public class DogUpdateDto
    {
        public string Name { get; set; }
        public string Breed { get; set; }
        public string Comment { get; set; }
        public string ImageUrl { get; set; }
        public int RatingSum { get; set; }
        public int RatingCount { get; set; }
    }
}
