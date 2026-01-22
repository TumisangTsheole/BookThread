using Microsoft.EntityFrameworkCore;
using BookThread.Data.DbService;
using BookThread.Data.Seeder;
using BookThread.Data.Entities;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();


// 1. Get the connection string from appsettings.json
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// 2. Register AppDbContext with the PostgreSQL provider
builder.Services.AddDbContext<BookThread.Data.DbService.AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// 3. Register The Seeder
builder.Services.AddTransient<DataSeeder>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var seeder = scope.ServiceProvider.GetRequiredService<DataSeeder>();
    await seeder.SeedAsync();
}


/////////////////// Fetch from the database test
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    var books = db.Books
        .Select(b => new { b.ISBN, b.Author, b.Title, b.AverageRating })
        .Take(5)
        .ToList();

    Console.WriteLine("📚 Books in database:");
    foreach (var book in books)
    {
        Console.WriteLine($"- {book.Title} by {book.Author} (ISBN: {book.ISBN}, Rating: {book.AverageRating})");
    }
}
//////////////////////////////////////////////////////////////////////

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
