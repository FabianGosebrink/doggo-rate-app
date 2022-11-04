using AutoMapper;
using DoggoApi.Dtos;
using DoggoApi.Entities;

namespace DoggoApi.MappingProfiles
{
    public class DoggoMappings : Profile
    {
        public DoggoMappings() { 
            CreateMap<DoggoEntity, DoggoDto>().ReverseMap();
        }
    }
}
