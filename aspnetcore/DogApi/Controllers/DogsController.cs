using AutoMapper;
using DogApi.Dtos;
using DogApi.Entities;
using DogApi.Hubs;
using DogApi.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace DogApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize("access:api")]
    public class DogsController : ControllerBase
    {
        public const int MAX_DOG_RATING_VALUE = 5;
        private readonly IDogRepository _repository;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor; 
        private readonly IHubContext<DogHub> _hubContext;

        public DogsController(
            IDogRepository dogRepository,
            IMapper mapper,
            IConfiguration configuration,
            IHttpContextAccessor httpContextAccessor,
            IHubContext<DogHub> hubContext)
        {
            _repository = dogRepository;
            _mapper = mapper;
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
            _hubContext = hubContext;
        }

        [HttpGet]
        [Route("value")]
        [AllowAnonymous]
        public ActionResult GetTestValue()
        {
            return Ok(_configuration.GetValue<string>("Auth0:Audience"));
        }

        [HttpGet(Name = nameof(GetAllDogs))]
        [AllowAnonymous]
        public ActionResult GetAllDogs()
        {
            List<DogEntity> dogs = _repository.GetAll().ToList();

            return Ok(_mapper.Map<DogDto[]>(dogs));
        }

        [HttpGet]
        [Route("{id:guid}", Name = nameof(GetSingleDog))]
        public ActionResult GetSingleDog(Guid id)
        {
            DogEntity? entity = _repository.GetSingle(id);

            if (entity == null)
            {
                return NotFound();
            }

            DogDto item = _mapper.Map<DogDto>(entity);

            return Ok(item);
        }

        [HttpGet]
        [Route("my", Name = nameof(GetMyDogs))]
        public ActionResult GetMyDogs()
        {
            string? userId = _httpContextAccessor.HttpContext?.User.Claims.Where(c => c.Type == ClaimTypes.NameIdentifier).SingleOrDefault()?.Value;

            if (userId == null)
            {
                return Ok(Array.Empty<DogDto>());
            }

            List<DogEntity> dogs = _repository.GetAllForUser(userId).ToList();

            return Ok(_mapper.Map<DogDto[]>(dogs));
        }

        [HttpPost(Name = nameof(AddDog))]
        public async Task<ActionResult<DogDto>> AddDog([FromBody] DogCreateDto createDto)
        {
            if (createDto == null)
            {
                return BadRequest();
            }

            string? userId = _httpContextAccessor.HttpContext?.User.Claims.Where(c => c.Type == ClaimTypes.NameIdentifier).SingleOrDefault()?.Value;

            if (userId == null)
            {
                return BadRequest();
            }

            DogEntity toAdd = _mapper.Map<DogEntity>(createDto);
            toAdd.Created = DateTime.UtcNow;
            toAdd.Id = Guid.NewGuid().ToString();
            toAdd.UserId = userId;

            _repository.Add(toAdd);

            if (!_repository.Save())
            {
                throw new Exception("Creating an item failed on save.");
            }

            DogEntity? newItem = _repository.GetSingle(Guid.Parse(toAdd.Id));
            DogDto dto = _mapper.Map<DogDto>(newItem);

            await _hubContext.Clients.All.SendAsync("DogAdded", dto);

            return CreatedAtRoute(nameof(GetSingleDog),
                new { id = newItem?.Id }, dto);
        }

        [HttpPut]
        [Route("rate/{id:guid}", Name = nameof(RateDog))]
        [AllowAnonymous]
        public async Task<ActionResult<DogDto>> RateDog(Guid id, [FromBody] DogRateDto rateDto)
        {
            if (rateDto == null)
            {
                return BadRequest();
            }

            DogEntity? existingEntity = _repository.GetSingle(id);

            if (existingEntity == null)
            {
                return NotFound();
            }

            if (rateDto.Value > MAX_DOG_RATING_VALUE)
            {
                return BadRequest();
            }

            existingEntity.RatingCount = existingEntity.RatingCount + 1;
            existingEntity.RatingSum = existingEntity.RatingSum + rateDto.Value;

            _repository.Update(existingEntity);

            if (!_repository.Save())
            {
                throw new Exception("Updating an item failed on save.");
            }

            DogDto dto = _mapper.Map<DogDto>(existingEntity);

            await _hubContext.Clients.All.SendAsync("DogRated", dto);

            return Ok(dto);
        }

        [HttpPut]
        [Route("{id:guid}", Name = nameof(UpdateDog))]
        public async Task<ActionResult<DogDto>> UpdateDog(Guid id, [FromBody] DogUpdateDto updateDto)
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

            string? userId = _httpContextAccessor.HttpContext?.User.Claims.Where(c => c.Type == ClaimTypes.NameIdentifier).SingleOrDefault()?.Value;

            if (userId == null)
            {
                return BadRequest();
            }

            if (userId != existingEntity.UserId)
            {
                return BadRequest();
            }

            _mapper.Map(updateDto, existingEntity);

            _repository.Update(existingEntity);

            if (!_repository.Save())
            {
                throw new Exception("Updating an item failed on save.");
            }

            DogDto dto = _mapper.Map<DogDto>(existingEntity);

            await _hubContext.Clients.All.SendAsync("DogUpdated", dto);

            return Ok(dto);
        }

        [HttpDelete]
        [Route("{id:guid}", Name = nameof(RemoveDog))]
        public async Task<ActionResult> RemoveDog(Guid id)
        {
            DogEntity? existingEntity = _repository.GetSingle(id);

            if (existingEntity == null)
            {
                return NotFound();
            }

            string? userId = _httpContextAccessor.HttpContext?.User.Claims.Where(c => c.Type == ClaimTypes.NameIdentifier).SingleOrDefault()?.Value;

            if (userId == null)
            {
                return BadRequest();
            }

            if (userId != existingEntity.UserId)
            {
                return BadRequest();
            }

            _repository.Delete(id);

            if (!_repository.Save())
            {
                throw new Exception("Deleting an item failed on save.");
            }

            await _hubContext.Clients.All.SendAsync("DogDeleted", id);

            return NoContent();
        }
    }
}
