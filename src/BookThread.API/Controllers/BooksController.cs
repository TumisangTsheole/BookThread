using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BookThread.Logic.Services;
using BookThread.Data.Entities;

namespace BookThread.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly BookService _bookService;

    public BooksController(BookService bookService)
    {
        _bookService = bookService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var books = await _bookService.GetAllAsync();
        return Ok(books);
    }

    [HttpGet("{isbn}")]
    public async Task<IActionResult> GetById(string isbn)
    {
        var book = await _bookService.GetByIdAsync(isbn);
        if (book == null) return NotFound();
        return Ok(book);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Book book)
    {
        var created = await _bookService.CreateAsync(book);
        return CreatedAtAction(nameof(GetById), new { isbn = created.ISBN }, created);
    }

    [HttpPut("{isbn}")]
    public async Task<IActionResult> Update(string isbn, Book updatedBook)
    {
        var success = await _bookService.UpdateAsync(isbn, updatedBook);
        if (!success) return NotFound();
        return NoContent();
    }

    [HttpDelete("{isbn}")]
    public async Task<IActionResult> Delete(string isbn)
    {
        var success = await _bookService.DeleteAsync(isbn);
        if (!success) return NotFound();
        return NoContent();
    }
}

