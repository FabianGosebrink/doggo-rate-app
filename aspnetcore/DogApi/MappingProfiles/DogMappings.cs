using AutoMapper;
using DogApi.Dtos;
using DogApi.Entities;

namespace DogApi.MappingProfiles
{
    public class DogMappings : Profile
    {
        public DogMappings() { 
            CreateMap<DogEntity, DogDto>().ReverseMap();
            CreateMap<DogEntity, DogCreateDto>().ReverseMap();
            CreateMap<DogEntity, DogUpdateDto>().ReverseMap();
        }
    }
}
