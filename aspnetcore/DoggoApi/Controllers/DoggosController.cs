using AutoMapper;
using DoggoApi.Dtos;
using DoggoApi.Entities;
using DoggoApi.Repositories;
using Microsoft.AspNetCore.Mvc;
using System;

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
            List<DoggoEntity> doggos = _repository.GetAll().ToList();

            return Ok(_mapper.Map<DoggoDto[]>(doggos));
        }

        [HttpGet]
        [Route("{id:guid}", Name = nameof(GetSingleDoggo))]
        public ActionResult GetSingleDoggo(Guid id)
        {
            DoggoEntity? entity = _repository.GetSingle(id);

            if (entity == null)
            {
                return NotFound();
            }

            DoggoDto item = _mapper.Map<DoggoDto>(entity);

            return Ok(item);
        }

        [HttpPost(Name = nameof(AddDoggo))]
        public ActionResult<DoggoDto> AddDoggo([FromBody] DoggoCreateDto createDto)
        {
            if (createDto == null)
            {
                return BadRequest();
            }

            DoggoEntity toAdd = _mapper.Map<DoggoEntity>(createDto);
            toAdd.Created = DateTime.UtcNow;
            toAdd.Id = Guid.NewGuid().ToString();

            _repository.Add(toAdd);

            if (!_repository.Save())
            {
                throw new Exception("Creating an item failed on save.");
            }

            DoggoEntity newItem = _repository.GetSingle(Guid.Parse(toAdd.Id));
            DoggoDto dto = _mapper.Map<DoggoDto>(newItem);

            return CreatedAtRoute(nameof(GetSingleDoggo),
                new { id = newItem.Id }, dto);
        }


        [HttpPut]
        [Route("{id:guid}", Name = nameof(UpdateDoggo))]
        public ActionResult<DoggoDto> UpdateDoggo(Guid id, [FromBody] DoggoUpdateDto updateDto)
        {
            if (updateDto == null)
            {
                return BadRequest();
            }

            var existingEntity = _repository.GetSingle(id);

            if (existingEntity == null)
            {
                return NotFound();
            }

            _mapper.Map(updateDto, existingEntity);

            _repository.Update(existingEntity);

            if (!_repository.Save())
            {
                throw new Exception("Updating an item failed on save.");
            }

            DoggoDto dto = _mapper.Map<DoggoDto>(existingEntity);

            return Ok(dto);
        }

        [HttpDelete]
        [Route("{id:guid}", Name = nameof(RemoveDoggo))]
        public ActionResult RemoveDoggo(Guid id)
        {
            DoggoEntity entity = _repository.GetSingle(id);

            if (entity == null)
            {
                return NotFound();
            }

            _repository.Delete(id);

            if (!_repository.Save())
            {
                throw new Exception("Deleting an item failed on save.");
            }

            return NoContent();
        }
    }
}
