using Microsoft.EntityFrameworkCore;
using BookThread.Data.DbService;
using BookThread.Data.Entities;
namespace BookThread.Logic.Services;

public interface ICrudService<T, TKey>
{
    Task<T?> GetByIdAsync(TKey id);
    Task<List<T>> GetAllAsync();
    Task<T> CreateAsync(T entity);
    Task<bool> UpdateAsync(TKey id, T entity);
    Task<bool> DeleteAsync(TKey id);
}
