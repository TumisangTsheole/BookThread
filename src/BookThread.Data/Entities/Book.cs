using System.ComponentModel.DataAnnotations;

namespace BookThread.Data.Entities;

public class Book
{
    [Key]
    [Required, MaxLength(13)]
    public required string ISBN { get; set; } // Changed to string

	[Required, StringLength(300)]
    public required string Title { get; set; }

    [StringLength(300)]
    public string? Subtitle { get; set; }   // optional

    [StringLength(200)]
    public string? Publisher { get; set; }

    [StringLength(20)]
    public string? PublishedDate { get; set; }

    [StringLength(4000)]
    public string? Description { get; set; }

    [Range(1, int.MaxValue)]
    public int? PageCount { get; set; }

    [Range(0, 5)]
    public double? AverageRating { get; set; }

    [Range(0, int.MaxValue)]
    public int? RatingsCount { get; set; }

    [StringLength(10)]
    public string? Language { get; set; }

    [Url]
    public string? PreviewLink { get; set; }

    [Url]
    public string? Thumbnail { get; set; }


	
    // Relationships
    public List<Thread> Threads { get; set; } = new();
    public List<UserBook> UserBooks { get; set; } = new();
}
