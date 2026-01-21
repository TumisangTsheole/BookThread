using Microsoft.EntityFrameworkCore;
using BookThread.Data.Entities;

namespace MyBookApp.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // Your Tables
    public DbSet<User> Users { get; set; }
    public DbSet<Book> Books { get; set; }
    public DbSet<BookThread.Data.Entities.Thread> Threads { get; set; }
    public DbSet<UserBook> UserBooks { get; set; }

    // Because convention are limiting we are manually creatinng the relationsips
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // 1. Define the "Composite Key" for our Junction Table
        // This tells the DB: A user can only link to the same book ONCE.
        modelBuilder.Entity<UserBook>()
            .HasKey(ub => new { ub.UserId, ub.BookISBN });

        // 2. Configure the Many-to-Many relationship
        modelBuilder.Entity<UserBook>()
            .HasOne(ub => ub.User)
            .WithMany(u => u.UserBooks)
            .HasForeignKey(ub => ub.UserId);

        modelBuilder.Entity<UserBook>()
            .HasOne(ub => ub.Book)
            .WithMany(b => b.UserBooks)
            .HasForeignKey(ub => ub.BookISBN);
            
        // 3. Thread configuration (Delete behavior)
        // If a User is deleted, their threads are deleted too (Cascade)
        modelBuilder.Entity<BookThread.Data.Entities.Thread>()
            .HasOne(t => t.User)
            .WithMany(u => u.Threads)
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
