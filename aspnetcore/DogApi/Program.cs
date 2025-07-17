using Azure.Storage.Blobs;
using DogApi;
using DogApi.Helpers;
using DogApi.Hubs;
using DogApi.MappingProfiles;
using DogApi.Repositories;
using DogApi.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=dogs.db";
builder.Services.AddSqlite<DogDbContext>(connectionString);

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Dog API",
        Description = "Rating Dogs is the best",
        Version = "v1"
    });
});

builder.Services.AddCustomCors("AllowAllOrigins");

string auth0Audience = builder.Configuration["Auth0:Audience"];
string auth0Domain = builder.Configuration["Auth0:Domain"];
string clientId = builder.Configuration["Auth0:ClientId"];

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
     .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, c =>
     {
         c.Authority = auth0Domain;
         c.Audience = auth0Audience;
         c.TokenValidationParameters = new TokenValidationParameters
         {
             ValidAudience = auth0Audience,
             ValidIssuer = auth0Domain,
             NameClaimType = ClaimTypes.NameIdentifier
         };
     });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("access:api", policy =>
    {
        policy.Requirements.Add(new UserApiScopeHandlerRequirement("access:api"));
        policy.RequireClaim("azp", clientId);
        policy.RequireClaim("iss", auth0Domain);
    });
});
builder.Services.AddSingleton<IAuthorizationHandler, UserApiScopeHandler>();

builder.Services.AddSingleton<ISeedDataService, SeedDataService>();
builder.Services.AddScoped<IDogRepository, DogSqlRepository>();
builder.Services.AddScoped<IBlobService, BlobService>();
builder.Services.AddRouting(options => options.LowercaseUrls = true);
builder.Services.AddHttpContextAccessor();
builder.Services.AddSignalR();

builder.Services.AddScoped(x => new BlobServiceClient(builder.Configuration.GetValue<string>("AzureBlobStorage")));
builder.Services.AddAutoMapper(typeof(DogMappings));

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Dog API V1");
});
app.SeedData();

app.UseDeveloperExceptionPage();

app.UseCors("AllowAllOrigins");
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<DogHub>("/dogHub");

app.Run();
