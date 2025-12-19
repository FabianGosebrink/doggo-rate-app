using Mapster;
using DogApi.Dtos;
using DogApi.Entities;

namespace DogApi.MappingProfiles
{
    public class DogMappings : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<DogEntity, DogDto>().TwoWays();
            config.NewConfig<DogEntity, DogCreateDto>().TwoWays();
            config.NewConfig<DogEntity, DogUpdateDto>().TwoWays();
        }
    }
}
