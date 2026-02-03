using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; // for [notmapped]

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

    // This property calculates the link dynamically based on the User's ID
    // Change "bottts" to "adventurer" or "pixel-art" for different cartoons!
    [NotMapped]
    public string AvatarLink => $"https://api.dicebear.com/7.x/adventurer/svg?seed={Id}"; 

    // Relationships
    // This is the "Join Table" list
    public List<UserBook> UserBooks { get; set; } = new();
    public List<Thread> Threads { get; set; } = new();
    public List<Comment> Comments { get; set; } = new();
}
