using Azure.Storage.Blobs;
using DoggoApi.Helpers;
using DoggoApi.MappingProfiles;
using DoggoApi.Repositories;
using DoggoApi.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=doggos.db";
builder.Services.AddSqlite<DoggoDbContext>(connectionString);

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Doggos API",
        Description = "Rating Doggos is the best",
        Version = "v1"
    });
});


builder.Services.AddCustomCors("AllowAllOrigins");

builder.Services.AddSingleton<ISeedDataService, SeedDataService>();
builder.Services.AddScoped<IDoggoRepository, DoggoSqlRepository>();
builder.Services.AddScoped<IBlobService, BlobService>();
builder.Services.AddRouting(options => options.LowercaseUrls = true);

builder.Services.AddScoped(x => new BlobServiceClient(builder.Configuration.GetValue<string>("AzureBlobStorage")));
builder.Services.AddAutoMapper(typeof(DoggoMappings));

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Doggos API V1");
});
app.SeedData();

app.UseCors("AllowAllOrigins");
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
