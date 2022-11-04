using AutoMapper;
using DoggoApi.Entities;
using DoggoApi.Repositories;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace DoggoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DoggosController : ControllerBase
    {
        private readonly IDoggoRepository _repository;
        private readonly IMapper _mapper;

        public DoggosController(
            IDoggoRepository doggoRepository,
            IMapper mapper)
        {
            _repository = doggoRepository;
            _mapper = mapper;
        }

        [HttpGet(Name = nameof(GetAllDoggos))]
        public ActionResult GetAllDoggos()
        {
            List<DoggoEntity> foodItems = _repository.GetAll().ToList();


            return Ok(foodItems);
        }
    }
}
