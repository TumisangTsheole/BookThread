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
        if (!_context.Books.Any())
        {
            _context.Books.AddRange(new[]
            {
                new Book { ISBN = "9780001", Title = "The Quantum BookThread.Data.Entities.Thread", Author = "Ava Light", AverageRating = 4.5 },
                new Book { ISBN = "9780002", Title = "Echoes of Ink", Author = "Juno Vale", AverageRating = 4.2 },
                new Book { ISBN = "9780003", Title = "Fragments of Fire", Author = "Kai Ember", AverageRating = 4.8 }
            });
        }

        if (!_context.Users.Any())
        {
            _context.Users.AddRange(new[]
            {
                new User { Id = Guid.NewGuid(), Username = "reader01", Email = "reader01@example.com", PasswordHash = "hashed_pw_1" },
                new User { Id = Guid.NewGuid(), Username = "bookworm", Email = "bookworm@example.com", PasswordHash = "hashed_pw_2" }
            });
        }

        await _context.SaveChangesAsync();

        var user = _context.Users.First();
        var book = _context.Books.First();

        if (!_context.Threads.Any())
        {
            _context.Threads.Add(new BookThread.Data.Entities.Thread
            {
                Content = "Loved the pacing and depth!",
                ThreadType = BookThread.Data.Entities.Thread.Type.Review,
                IsSpoiler = false,
                UserId = user.Id,
                BookISBN = book.ISBN
            });
        }

        if (!_context.UserBooks.Any())
        {
            _context.UserBooks.Add(new UserBook
            {
                UserId = user.Id,
                BookISBN = book.ISBN,
                Status = "Reading",
                Progress = 45
            });
        }

        await _context.SaveChangesAsync();
    }
}
