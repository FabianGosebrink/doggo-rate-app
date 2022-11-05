using Azure.Storage.Blobs;
using DoggoApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace DoggoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UploadController : ControllerBase
    {
        private readonly IBlobService _blobService;

        public UploadController(IBlobService blobService)
        {
            _blobService = blobService;
        }

        [HttpPost("image"), DisableRequestSizeLimit]
        public async Task<ActionResult> UploadProfilePicture()
        {
            if (!Request.Form.Files.Any())
            {
                return Ok(new { path = "" });
            }

            IFormFile file = Request.Form.Files[0];
            if (file == null)
            {
                return BadRequest();
            }

            BlobClient result = await _blobService.UploadFileBlobAsync("doggos", file.OpenReadStream(), file.ContentType, file.FileName);

            var toReturn = result.Uri.AbsoluteUri;

            return Ok(new { path = toReturn });
        }
    }
}
