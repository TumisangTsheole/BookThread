using BookThread.Logic.Services;
using BookThread.Data.Entities;
using BookThread.Data.DbService;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.InMemory;
using Xunit;

namespace BookThread.Tests.Unit;

public class ThreadServiceTests
{
    private readonly AppDbContext _dbContext;
    private readonly ThreadService _service;

    public ThreadServiceTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()).Options;

        _dbContext = new AppDbContext(options);
		_dbContext.Database.EnsureDeleted();
        _service = new ThreadService(_dbContext);

        SeedData();
    }

    private void SeedData()
    {
        var userId = Guid.NewGuid();
        
        _dbContext.Users.Add(new User
        {
            Id = userId,
            Username = "TestUser",
            Email = "test@example.com",
            PasswordHash = "hashedpassword123"
        });
        
        _dbContext.Books.Add(new Book
        {
            ISBN = "123",
            Title = "Test Book"
        });
        
        _dbContext.Threads.Add(new BookThread.Data.Entities.Thread
        {
            Id = 1,
            Content = "Initial thread",
            ThreadType = BookThread.Data.Entities.Thread.Type.Review,
            IsSpoiler = false,
            BookISBN = "123",
            UserId = userId
        });
        
        _dbContext.SaveChanges();
    }

    [Fact]
    public async Task GetAllThreads_ReturnsListAsync()
    {    	 
       var result = await _service.GetAllAsync();
        Assert.Single(result);
    }

    [Fact]
    public async Task GetById_ReturnsThreadAsync()
    {
        var result = await _service.GetByIdAsync(1);
        Assert.NotNull(result);
        Assert.Equal(BookThread.Data.Entities.Thread.Type.Review, result.ThreadType);
    }

    [Fact]
    public async Task DeleteAsync_RemovesThread()
    {
        var success = await _service.DeleteAsync(1);
        Assert.True(success);
        Assert.Empty(await _service.GetAllAsync());
    }
}
