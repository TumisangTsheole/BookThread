using Microsoft.EntityFrameworkCore;
using BookThread.Data.DbService;
using BookThread.Data.Entities;
namespace BookThread.Logic.Services;


public class ThreadService : ICrudService<BookThread.Data.Entities.Thread, int>
{
    private readonly AppDbContext _context;

    public ThreadService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<BookThread.Data.Entities.Thread?> GetByIdAsync(int id)
    {
        return await _context.Threads
            .Include(t => t.User)
            .Include(t => t.Book)
            .FirstOrDefaultAsync(t => t.Id == id);
    }
    
    public async Task<List<BookThread.Data.Entities.Thread>> GetAllAsync()
    {
        return await _context.Threads
            .Include(t => t.User)
            .Include(t => t.Book)
            .ToListAsync();
    }

    public async Task<BookThread.Data.Entities.Thread> CreateAsync(BookThread.Data.Entities.Thread thread)
    {
        _context.Threads.Add(thread);
        await _context.SaveChangesAsync();
        return thread;
    }

    public async Task<bool> UpdateAsync(int id, BookThread.Data.Entities.Thread updatedThread)
    {
        var thread = await GetByIdAsync(id);
        if (thread == null) return false;

        thread.Content = updatedThread.Content;
        thread.ThreadType = updatedThread.ThreadType;
        thread.IsSpoiler = updatedThread.IsSpoiler;
        thread.BookISBN = updatedThread.BookISBN;
        thread.UserId = updatedThread.UserId;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var thread = await GetByIdAsync(id);
        if (thread == null) return false;

        _context.Threads.Remove(thread);
        await _context.SaveChangesAsync();
        return true;
    }
}
