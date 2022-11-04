namespace DoggoApi.Dtos
{
    public class DoggoDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Breed { get; set; }
        public string Comment { get; set; }
        public string ImageUrl { get; set; }
        public int[] Ratings { get; set; }
        public DateTime Created { get; set; }
    }
}
