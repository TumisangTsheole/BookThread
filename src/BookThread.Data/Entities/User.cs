using System.ComponentModel.DataAnnotations;

namespace BookThread.Data.Entities;

public class User
{
    [Key]
    public Guid Id { get; set; } // Using Guid is better for security/scaling

    [Required, MaxLength(50)]
    public required string Username { get; set; }

    [Required, EmailAddress]
    public required string Email { get; set; }

    [Required]
    public required string PasswordHash { get; set; }

    [MaxLength(150)]
    public string? Bio { get; set; } 

    // Relationships
    // This is the "Join Table" list
    public List<UserBook> UserBooks { get; set; } = new();
    public List<Thread> Threads { get; set; } = new();
    public List<Comment> Comments { get; set; } = new();
}
