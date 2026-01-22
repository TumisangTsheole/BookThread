using BookThread.Logic.Services;
using BookThread.Data.Entities;
using BookThread.Data.DbService;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.InMemory;
using Xunit;

namespace BookThread.Tests.Unit;

public class UserBookServiceTests
{
    private readonly AppDbContext _dbContext;
    private readonly UserBookService _service;
    private readonly Guid _userId = Guid.NewGuid();

    public UserBookServiceTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: "UserBookTestDb").Options;

        _dbContext = new AppDbContext(options);
		_dbContext.Database.EnsureDeleted();
        _service = new UserBookService(_dbContext);

        SeedData();
    }

    private void SeedData()
    {
        _dbContext.UserBooks.Add(new UserBook
        {
            UserId = _userId,
            BookISBN = "123",
            Status = "Reading",
            Progress = 50
        });
        _dbContext.SaveChanges();
    }

    [Fact]
    public async Task GetAllUserBooks_ReturnsListAsync()
    {
        var result = await _service.GetAllAsync();
        Assert.Single(result);
    }

    [Fact]
    public async Task GetByCompositeKey_ReturnsUserBookAsync()
    {
        var result = await _service.GetByCompositeKeyAsync(_userId, "123");
        Assert.NotNull(result);
        Assert.Equal("Reading", result.Status);
    }

    [Fact]
    public async Task DeleteAsync_RemovesUserBook()
    {
        var success = await _service.DeleteAsync(_userId, "123");
        Assert.True(success);
        Assert.Empty(await _service.GetAllAsync());
    }
}
