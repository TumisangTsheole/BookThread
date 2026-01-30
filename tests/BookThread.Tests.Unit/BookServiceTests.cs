using BookThread.Logic.Services;
using BookThread.Data.Entities;
using BookThread.Data.DbService;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.InMemory;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Xunit;

namespace BookThread.Tests.Unit
{
    public class BookServiceTests
    {
        private readonly AppDbContext _dbContext;
        private readonly BookService _service;

        public BookServiceTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>().UseInMemoryDatabase(databaseName: "BookTestDb").ConfigureWarnings(x => x.Ignore(CoreEventId.NavigationBaseIncludeIgnored))
                .Options;

            _dbContext = new AppDbContext(options);
			_dbContext.Database.EnsureDeleted();
            _service = new BookService(_dbContext);

            SeedData();
        }

        private void SeedData()
        {
            _dbContext.Books.Add(new Book
            {
                // Required properties
                    ISBN = "9780143127741",
                    Title = "The Quantum Librarian",
                
                    // Optional properties
                    Subtitle = "A Journey Through the Multiverse of Lost Records",
                    Publisher = "Aether Press",
                    PublishedDate = "2025-11-12",
                    Description = "In a world where every forgotten thought is archived, one librarian must protect the ultimate secret from those who wish to rewrite history.",
                    PageCount = 412,
                    AverageRating = 4.8,
                    RatingsCount = 1250,
                    Language = "en",
                    PreviewLink = "https://books.example.com/preview/9780143127741",
                    Thumbnail = "https://books.example.com/images/9780143127741.jpg"
            });
            _dbContext.SaveChanges();
        }

        [Fact]
        public async Task GetAllBooks_ReturnsList()
        {
            var result = await _service.GetAllAsync();
            Assert.Single(result);
            Assert.Equal("The Quantum Librarian", result.First().Title);
        }
    }
}
