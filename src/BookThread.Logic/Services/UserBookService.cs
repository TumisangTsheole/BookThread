using Microsoft.EntityFrameworkCore;
using BookThread.Data.DbService;
using BookThread.Data.Entities;
namespace BookThread.Logic.Services;


public class UserBookService
{
    private readonly AppDbContext _context;

    public UserBookService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<UserBook?> GetByCompositeKeyAsync(Guid userId, string bookISBN)
    {
        return await _context.UserBooks
            .Include(ub => ub.User)
            .Include(ub => ub.Book)
            .FirstOrDefaultAsync(ub => ub.UserId == userId && ub.BookISBN == bookISBN);
    }
    
    public async Task<List<UserBook>> GetAllAsync()
    {
        return await _context.UserBooks
            .Include(ub => ub.User)
            .Include(ub => ub.Book)
            .ToListAsync();
    }

    public async Task<UserBook> CreateAsync(UserBook userBook)
    {
        _context.UserBooks.Add(userBook);
        await _context.SaveChangesAsync();
        return userBook;
    }

    public async Task<bool> UpdateAsync(Guid userId, string bookISBN, UserBook updatedUserBook)
    {
        var userBook = await GetByCompositeKeyAsync(userId, bookISBN);
        if (userBook == null) return false;

        userBook.Status = updatedUserBook.Status;
        userBook.Progress = updatedUserBook.Progress;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(Guid userId, string bookISBN)
    {
        var userBook = await GetByCompositeKeyAsync(userId, bookISBN);
        if (userBook == null) return false;

        _context.UserBooks.Remove(userBook);
        await _context.SaveChangesAsync();
        return true;
    }
}
