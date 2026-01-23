using Microsoft.EntityFrameworkCore;
using BookThread.Data.DbService;
using BookThread.Data.Seeder;
using BookThread.Data.Entities;
using BookThread.Logic.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Get the connection string from appsettings.json
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Register AppDbContext with the PostgreSQL provider
builder.Services.AddDbContext<BookThread.Data.DbService.AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// Register The Seeder
builder.Services.AddTransient<DataSeeder>();

// Register your services
builder.Services.AddScoped<BookService>();
builder.Services.AddScoped<ThreadService>();
builder.Services.AddScoped<UserBookService>();
builder.Services.AddScoped<UserService>();

// Add controllers
builder.Services.AddControllers();




var app = builder.Build();

// Seed the database
using (var scope = app.Services.CreateScope())
{
    var seeder = scope.ServiceProvider.GetRequiredService<DataSeeder>();
    await seeder.SeedAsync();
}




// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    
}

app.UseHttpsRedirection();
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

