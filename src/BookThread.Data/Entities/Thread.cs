using System.ComponentModel.DataAnnotations;

namespace BookThread.Data.Entities;

public class Thread
{
    public enum Type { Quote, Progress, Review, Thought };

    [Key]
    public int Id { get; set; }

    [Required, MaxLength(280)] // Twitter-style limit
    public required string Content { get; set; }

    public Type ThreadType { get; set; }
    public bool IsSpoiler { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Relationships
    public Guid UserId { get; set; } // The ID
    public User User { get; set; } = null!; // The Navigation Object

    public string BookISBN { get; set; } = null!;
    public Book Book { get; set; } = null!;

    public List<Comment> Comments { get; set; } = null!;
    
}
