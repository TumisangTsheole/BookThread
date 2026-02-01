using System.ComponentModel.DataAnnotations;

namespace BookThread.Data.Entities;

public class Comment 
{
	[Required, Key]
	public required Guid Id { get; set; }

	[Required, StringLength(1000)]
	public string Content { get; set; } = null!;

	public Guid UserId { get; set; }
	public User User { get; set; } = null!;		

	public int ThreadId { get; set; }
	public Thread Thread { get; set; } = null!;
	
	// Implement Later
	//public int Likes { get; set; } = 0;
}
