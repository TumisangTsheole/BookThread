using Microsoft.EntityFrameworkCore;
using BookThread.Data.DbService;
using BookThread.Data.Entities;
namespace BookThread.Logic.Services;

public class BookService : ICrudService<Book, string>
{
    private readonly AppDbContext _context;

    public BookService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Book?> GetByIdAsync(string isbn)
    {
        return await _context.Books.FirstOrDefaultAsync(b => b.ISBN == isbn);
    }

    public async Task<List<Book>> GetAllAsync()
    {
        return await _context.Books.ToListAsync();
    }

    public async Task<Book> CreateAsync(Book book)
    {
        _context.Books.Add(book);
        await _context.SaveChangesAsync();
        return book;
    }

    public async Task<bool> UpdateAsync(string isbn, Book updatedBook)
    {
        var book = await GetByIdAsync(isbn);
        if (book == null) return false;

        book.Title = updatedBook.Title;
        book.Author = updatedBook.Author;
        book.CoverUrl = updatedBook.CoverUrl;
        book.AverageRating = updatedBook.AverageRating;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(string isbn)
    {
        var book = await GetByIdAsync(isbn);
        if (book == null) return false;

        _context.Books.Remove(book);
        await _context.SaveChangesAsync();
        return true;
    }
}
