using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using System.IO;
using System.Threading.Tasks;

namespace DoggoApi.Services
{
    public interface IBlobService
    {
        Task<BlobClient> UploadFileBlobAsync(string blobContainerName, Stream content, string contentType, string fileName);
    }
}