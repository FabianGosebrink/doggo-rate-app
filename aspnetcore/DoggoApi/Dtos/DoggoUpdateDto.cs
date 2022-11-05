namespace DoggoApi.Dtos
{
    public class DoggoUpdateDto
    {
        public string Name { get; set; }
        public string Breed { get; set; }
        public string Comment { get; set; }
        public string ImageUrl { get; set; }
        public int RatingSum { get; set; }
        public int RatingCount { get; set; }
    }
}
