// Scalar OpenApi
using Scalar.AspNetCore;
using Microsoft.AspNetCore.OpenApi;

using Microsoft.EntityFrameworkCore;
using BookThread.Data.DbService;
using BookThread.Data.Seeder;
using BookThread.Data.Entities;
using BookThread.Logic.Services;

// Authentication Imports
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.IdentityModel.JsonWebTokens;
using System.Text;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
	.AddJsonOptions(options =>
	    {
	        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
	    });

//	options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme; 
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
	options.RequireHttpsMetadata = false;
    options.SaveToken = true;
	
	
	options.TokenValidationParameters = new TokenValidationParameters
	{
		ValidateIssuer = true,
		ValidateAudience = true,
		ValidateLifetime = false,
		ValidateIssuerSigningKey = true,
		ValidIssuer = builder.Configuration["Jwt:Issuer"],
		ValidAudience = builder.Configuration["Jwt:Audience"],
		IssuerSigningKey = new SymmetricSecurityKey(
			Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
	};

	 // ? Prevent ASP.NET from looking for 'kid' or metadata
    options.Configuration = null; // empty config


	options.Events = new JwtBearerEvents
	{
	    OnAuthenticationFailed = context =>
	    {
	        Console.WriteLine("Authentication failed: " + context.Exception.Message);
	        return Task.CompletedTask;
	    }
	};
});

builder.Services.AddAuthorization();
builder.Services.AddOpenApi();
//builder.Services.AddEndpointsApiExplorer();
/*builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "BookThread API", Version = "v1" });

    // Add JWT Bearer definition
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Enter 'Bearer' followed by your JWT token.\nExample: Bearer eyJhbGciOiJIUzI1NiIsInR..."
    });

    // Apply globally
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});
*/

// Get the connection string from appsettings.json
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Register AppDbContext with the PostgreSQL provider
builder.Services.AddDbContext<BookThread.Data.DbService.AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// Register The Seeder
builder.Services.AddScoped<DataSeeder>();

// Register your services
builder.Services.AddScoped<BookService>();
builder.Services.AddScoped<ThreadService>();
builder.Services.AddScoped<UserBookService>();
builder.Services.AddScoped<UserService>();




// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
           // policy.WithOrigins("http://localhost:5173", "http://localhost:3000") // React dev servers
               policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});




var app = builder.Build();

// Seed the database
/*using (var scope = app.Services.CreateScope())
{
    var seeder = scope.ServiceProvider.GetRequiredService<DataSeeder>();
    await seeder.SeedAsync();
}*/
if (app.Environment.IsDevelopment())
{
/*	app.UseSwagger();
	app.UseSwaggerUI( options =>
		{
			options.SwaggerEndpoint("/swagger/v1/swagger.json", "My API v1");
			options.RoutePrefix = "swagger";
	);
		}
*/

	app.MapOpenApi();
	app.MapScalarApiReference(); // Generates the SCalarUI at scalar/v1
}



using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var seeder = services.GetRequiredService<DataSeeder>();
    await seeder.SeedAsync();   // runtime seeding
}

// Add auth 
app.UseAuthentication();
app.UseAuthorization();
// Enable CORS
app.UseCors("AllowFrontend");


app.UseHttpsRedirection();

//app.UseAuthorization();
app.MapControllers();

app.Run();
