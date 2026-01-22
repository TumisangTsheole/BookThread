using BookThread.Logic.Services;
using BookThread.Data.Entities;
using BookThread.Data.DbService;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.InMemory;
using Xunit;

namespace BookThread.Tests.Unit
{
    public class BookServiceTests
    {
        private readonly AppDbContext _dbContext;
        private readonly BookService _service;

        public BookServiceTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>().UseInMemoryDatabase(databaseName: "BookTestDb").Options;

            _dbContext = new AppDbContext(options);
			_dbContext.Database.EnsureDeleted();
            _service = new BookService(_dbContext);

            SeedData();
        }

        private void SeedData()
        {
            _dbContext.Books.Add(new Book
            {
                ISBN = "123",
                Title = "Test Book",
                Author = "Author A",
                AverageRating = 4.5
            });
            _dbContext.SaveChanges();
        }

        [Fact]
        public async Task GetAllBooks_ReturnsList()
        {
            var result = await _service.GetAllAsync();
            Assert.Single(result);
            Assert.Equal("Test Book", result.First().Title);
        }
    }
}
