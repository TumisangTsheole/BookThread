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
        return await _context.Books
            .Include(b => b.Threads)
                .ThenInclude(t => t.User)
            .Include(b => b.UserBooks)
                .ThenInclude(ub => ub.User)
            .Include(b => b.UserBooks)
                .ThenInclude(ub => ub.Book)
            .FirstOrDefaultAsync(b => b.ISBN == isbn);
    }
    
    public async Task<List<Book>> GetAllAsync()
    {
        return await _context.Books
            .Include(b => b.Threads)
                .ThenInclude(t => t.User)
            .Include(b => b.UserBooks)
                .ThenInclude(ub => ub.User)
            .Include(b => b.UserBooks)
                .ThenInclude(ub => ub.Book)
            .ToListAsync();
    }

	public async Task<bool> UpdateAsync(string isbn, Book updatedBook)
	{
	    var book = await GetByIdAsync(isbn);
	    if (book == null) return false;

	    // Update fields that exist in your Book model
	    book.Title = updatedBook.Title;
	    book.Subtitle = updatedBook.Subtitle;
	    book.Publisher = updatedBook.Publisher;
	    book.PublishedDate = updatedBook.PublishedDate;
	    book.Description = updatedBook.Description;
	    book.PageCount = updatedBook.PageCount;
	    book.AverageRating = updatedBook.AverageRating;
	    book.RatingsCount = updatedBook.RatingsCount;
	    book.Language = updatedBook.Language;
	    book.PreviewLink = updatedBook.PreviewLink;
	    book.Thumbnail = updatedBook.Thumbnail;

	    await _context.SaveChangesAsync();
	    return true;
	}

    public async Task<Book> CreateAsync(Book book)
    {
        _context.Books.Add(book);
        await _context.SaveChangesAsync();
        return book;
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
