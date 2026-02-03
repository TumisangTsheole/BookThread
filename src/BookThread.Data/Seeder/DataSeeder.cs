using Microsoft.EntityFrameworkCore;
using BookThread.Data.DbService;
using BookThread.Data.Entities;

namespace BookThread.Data.Seeder;

public class DataSeeder
{
    private readonly AppDbContext _context;

    public DataSeeder(AppDbContext context)
    {
        _context = context;
    }

    public async Task SeedAsync()
    {
        // --- Seed Users ---
        if (!await _context.Users.AnyAsync())
        {
            var users = new[]
            {
                new User { Id = Guid.NewGuid(), Username = "alice", Email = "alice@example.com", PasswordHash = "hashedpassword1", Bio = "Avid reader of fantasy novels." },
                new User { Id = Guid.NewGuid(), Username = "bob", Email = "bob@example.com", PasswordHash = "hashedpassword2", Bio = "Enjoys sci-fi and tech books." }
            };

            await _context.Users.AddRangeAsync(users);
            await _context.SaveChangesAsync();
        }

        // --- Seed Books ---
        if (!await _context.Books.AnyAsync())
        {
            var books = new[]
            {
                new Book { ISBN = "9780439136358", Title = "Harry Potter and the Prisoner of Azkaban", Publisher = "Scholastic", PublishedDate = "1999", Description = "Harry Potter's third year at Hogwarts...", PageCount = 435, AverageRating = 4.5, RatingsCount = 1200, Language = "en", PreviewLink = "https://books.google.com/harrypotter", Thumbnail = "https://books.google.com/cover.jpg" },
                new Book { ISBN = "9780553386790", Title = "A Game of Thrones", Publisher = "Bantam", PublishedDate = "1996", Description = "The first book in George R.R. Martin's epic fantasy series.", PageCount = 694, AverageRating = 4.7, RatingsCount = 2000, Language = "en", PreviewLink = "https://books.google.com/gameofthrones", Thumbnail = "https://books.google.com/gotcover.jpg" }
            };

            await _context.Books.AddRangeAsync(books);
            await _context.SaveChangesAsync();
        }

        // --- Seed Threads ---
        if (!await _context.Threads.AnyAsync())
        {
            var user = await _context.Users.FirstAsync();
            var book = await _context.Books.FirstAsync();

            var thread = new BookThread.Data.Entities.Thread
            {
                Content = "This chapter blew my mind!",
                ThreadType = BookThread.Data.Entities.Thread.Type.Quote,
                IsSpoiler = false,
                UserId = user.Id,
                BookISBN = book.ISBN,
                CreatedAt = DateTime.UtcNow
            };

            await _context.Threads.AddAsync(thread);
            await _context.SaveChangesAsync();
        }

        // --- Seed UserBooks ---
        if (!await _context.UserBooks.AnyAsync())
        {
            var user = await _context.Users.FirstAsync();
            var book = await _context.Books.FirstAsync();

            var userBook = new UserBook
            {
                UserId = user.Id,
                BookISBN = book.ISBN,
                Status = "Reading",
                Progress = 45
            };

            await _context.UserBooks.AddAsync(userBook);
            await _context.SaveChangesAsync();
        }

        if (!await _context.Comments.AnyAsync())
        {
        	var user = await _context.Users.FirstAsync();
        	var thread = await _context.Threads.FirstAsync();
        	 
        	var comment = new Comment
        	{
        		Id = Guid.NewGuid(),
        		Content = "I really feel the same way, enjoying this book so far!!",
        		UserId = user.Id,
        		ThreadId = thread.Id	
        	};
        	
        	await _context.Comments.AddAsync(comment);
        	await _context.SaveChangesAsync();
        }
    }
}
