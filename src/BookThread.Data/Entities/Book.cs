using System.ComponentModel.DataAnnotations;

namespace BookThread.Data.Entities;

public class Book
{
    [Key]
    [Required, MaxLength(13)]
    public required string ISBN { get; set; } // Changed to string

    [Required, MaxLength(200)]
    public required string Title { get; set; }

    [Required, MaxLength(100)]
    public required string Author { get; set; }

    public string? CoverUrl { get; set; }
    
    public double AverageRating { get; set; } // Changed to double for 4.5 star ratings

    // Relationships
    public List<Thread> Threads { get; set; } = new();
    public List<UserBook> UserBooks { get; set; } = new();
}
