using BookThread.Logic.Services;
using BookThread.Data.Entities;
using BookThread.Data.DbService;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.InMemory;
using Xunit;

namespace BookThread.Tests.Unit;

public class UserServiceTests
{
    private readonly AppDbContext _dbContext;
    private readonly UserService _service;
    private readonly Guid _userId = Guid.NewGuid();

    public UserServiceTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: "UserTestDb").Options;

        _dbContext = new AppDbContext(options);
        _dbContext.Database.EnsureDeleted();
        _service = new UserService(_dbContext);

        SeedData();
    }

    private void SeedData()
    {
        _dbContext.Users.Add(new User
        {
            Id = _userId,
            Username = "testuser",
            Email = "test@example.com",
            PasswordHash = "hashed",
            Bio = "Just a test user"
        });
        _dbContext.SaveChanges();
    }

    [Fact]
    public async Task GetAllUsers_ReturnsListAsync()
    {
        var result = await _service.GetAllAsync();
        Assert.Single(result);
    }

    [Fact]
    public async Task GetById_ReturnsUserAsync()
    {
        var result = await _service.GetByIdAsync(_userId);
        Assert.NotNull(result);
        Assert.Equal("testuser", result.Username);
    }

    [Fact]
    public async Task DeleteAsync_RemovesUser()
    {
        var success = await _service.DeleteAsync(_userId);
        Assert.True(success);
        Assert.Empty(await _service.GetAllAsync());
    }
}
