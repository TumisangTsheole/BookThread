namespace BookThread.Data.Entities;

public class UserBook
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public string BookISBN { get; set; } = null!;
    public Book Book { get; set; } = null!;

    public string Status { get; set; } = "WantToRead"; // Reading, Finished, etc.
    public int Progress { get; set; } // For reading progress %
}
