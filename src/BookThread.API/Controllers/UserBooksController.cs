using Microsoft.AspNetCore.Mvc;
using BookThread.Logic.Services;
using BookThread.Data.Entities;

namespace BookThread.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserBooksController : ControllerBase
{
    private readonly UserBookService _userBookService;

    public UserBooksController(UserBookService userBookService)
    {
        _userBookService = userBookService;
    }


    public async Task<IActionResult> GetAll() => Ok(await _userBookService.GetAllAsync());

    [HttpGet("{userId}/{bookISBN}")]
    public async Task<IActionResult> GetByCompositeKey(Guid userId, string bookISBN)
    {
        var userBook = await _userBookService.GetByCompositeKeyAsync(userId, bookISBN);
        return userBook == null ? NotFound() : Ok(userBook);
    }

    [HttpPost]
    public async Task<IActionResult> Create(UserBook userBook)
    {
        var created = await _userBookService.CreateAsync(userBook);
        return CreatedAtAction(nameof(GetByCompositeKey),
            new { userId = created.UserId, bookISBN = created.BookISBN }, created);
    }

    [HttpPut("{userId}/{bookISBN}")]
    public async Task<IActionResult> Update(Guid userId, string bookISBN, UserBook updatedUserBook)
    {
        var success = await _userBookService.UpdateAsync(userId, bookISBN, updatedUserBook);
        return success ? NoContent() : NotFound();
    }

    [HttpDelete("{userId}/{bookISBN}")]
    public async Task<IActionResult> Delete(Guid userId, string bookISBN)
    {
        var success = await _userBookService.DeleteAsync(userId, bookISBN);
        return success ? NoContent() : NotFound();
    }
}
