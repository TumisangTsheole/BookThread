using Microsoft.AspNetCore.Mvc;
using BookThread.Logic.Services;
using BookThread.Data.Entities;

namespace BookThread.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ThreadsController : ControllerBase
{
    private readonly ThreadService _threadService;

    public ThreadsController(ThreadService threadService)
    {
        _threadService = threadService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _threadService.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var thread = await _threadService.GetByIdAsync(id);
        return thread == null ? NotFound() : Ok(thread);
    }

    [HttpPost]
    public async Task<IActionResult> Create(BookThread.Data.Entities.Thread thread)
    {
        var created = await _threadService.CreateAsync(thread);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, BookThread.Data.Entities.Thread updatedThread)
    {
        var success = await _threadService.UpdateAsync(id, updatedThread);
        return success ? NoContent() : NotFound();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _threadService.DeleteAsync(id);
        return success ? NoContent() : NotFound();
    }
}
