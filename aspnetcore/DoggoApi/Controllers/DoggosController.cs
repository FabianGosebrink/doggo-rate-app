using AutoMapper;
using DoggoApi.Dtos;
using DoggoApi.Entities;
using DoggoApi.Hubs;
using DoggoApi.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace DoggoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize("access:api")]
    public class DoggosController : ControllerBase
    {
        public const int MAX_DOGGO_RATING_VALUE = 5;
        private readonly IDoggoRepository _repository;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor; 
        private readonly IHubContext<DoggoHub> _hubContext;

        public DoggosController(
            IDoggoRepository doggoRepository,
            IMapper mapper,
            IConfiguration configuration,
            IHttpContextAccessor httpContextAccessor,
            IHubContext<DoggoHub> hubContext)
        {
            _repository = doggoRepository;
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

        [HttpGet(Name = nameof(GetAllDoggos))]
        [AllowAnonymous]
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

        [HttpGet]
        [Route("my", Name = nameof(GetMyDoggos))]
        public ActionResult GetMyDoggos()
        {
            string? userId = _httpContextAccessor.HttpContext?.User.Claims.Where(c => c.Type == ClaimTypes.NameIdentifier).SingleOrDefault()?.Value;

            if (userId == null)
            {
                return Ok(Array.Empty<DoggoDto>());
            }

            List<DoggoEntity> doggos = _repository.GetAllForUser(userId).ToList();

            return Ok(_mapper.Map<DoggoDto[]>(doggos));
        }

        [HttpPost(Name = nameof(AddDoggo))]
        public async Task<ActionResult<DoggoDto>> AddDoggo([FromBody] DoggoCreateDto createDto)
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

            DoggoEntity toAdd = _mapper.Map<DoggoEntity>(createDto);
            toAdd.Created = DateTime.UtcNow;
            toAdd.Id = Guid.NewGuid().ToString();
            toAdd.UserId = userId;

            _repository.Add(toAdd);

            if (!_repository.Save())
            {
                throw new Exception("Creating an item failed on save.");
            }

            DoggoEntity? newItem = _repository.GetSingle(Guid.Parse(toAdd.Id));
            DoggoDto dto = _mapper.Map<DoggoDto>(newItem);

            await _hubContext.Clients.All.SendAsync("DoggoAdded", dto);

            return CreatedAtRoute(nameof(GetSingleDoggo),
                new { id = newItem?.Id }, dto);
        }

        [HttpPut]
        [Route("rate/{id:guid}", Name = nameof(RateDoggo))]
        [AllowAnonymous]
        public async Task<ActionResult<DoggoDto>> RateDoggo(Guid id, [FromBody] DoggoRateDto rateDto)
        {
            if (rateDto == null)
            {
                return BadRequest();
            }

            DoggoEntity? existingEntity = _repository.GetSingle(id);

            if (existingEntity == null)
            {
                return NotFound();
            }

            if (rateDto.Value > MAX_DOGGO_RATING_VALUE)
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

            DoggoDto dto = _mapper.Map<DoggoDto>(existingEntity);

            await _hubContext.Clients.All.SendAsync("DoggoRated", dto);

            return Ok(dto);
        }

        [HttpPut]
        [Route("{id:guid}", Name = nameof(UpdateDoggo))]
        public async Task<ActionResult<DoggoDto>> UpdateDoggo(Guid id, [FromBody] DoggoUpdateDto updateDto)
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

            DoggoDto dto = _mapper.Map<DoggoDto>(existingEntity);

            await _hubContext.Clients.All.SendAsync("DoggoUpdated", dto);

            return Ok(dto);
        }

        [HttpDelete]
        [Route("{id:guid}", Name = nameof(RemoveDoggo))]
        public async Task<ActionResult> RemoveDoggo(Guid id)
        {
            DoggoEntity? existingEntity = _repository.GetSingle(id);

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

            await _hubContext.Clients.All.SendAsync("DoggoDeleted", id);

            return NoContent();
        }
    }
}
