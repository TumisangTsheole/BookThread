namespace BookThread.Data.Entities;

public class UserBook
{
    public required Guid UserId { get; set; }
    public User? User { get; set; } = null!;

    public required string BookISBN { get; set; }
    public Book? Book { get; set; }

    public string Status { get; set; } = "WantToRead"; // Reading, Finished, etc.
    public int Progress { get; set; } // For reading progress %
}
