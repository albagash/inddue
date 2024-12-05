using INDUENDUM_API.Models;
using INDUENDUM_API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Kërkon autentifikim për të gjitha metodat
public class CollectionsController : ControllerBase
{
    private readonly AppDbContext _context;

    public CollectionsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: /api/collections/{userId}
    [HttpGet("{userId}")]
    public async Task<IActionResult> GetCollectionsByUser(string userId)
    {
        try
        {
            var collections = await _context.Collections
                .Where(c => c.UserId == userId)
                .Include(c => c.Products) // Përfshi produktet në koleksion
                .ToListAsync();

            if (!collections.Any())
                return NotFound("Nuk u gjetën koleksione për këtë përdorues.");

            return Ok(collections);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Gabim gjatë marrjes së koleksioneve: {ex.Message}");
        }
    }

    // POST: /api/collections
    [HttpPost]
    [Authorize(Roles = "User")] // Vetëm përdoruesit mund të krijojnë koleksione
    public async Task<IActionResult> CreateCollection([FromBody] Collection collection)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            // Kontrollo nëse përdoruesi ekziston
            var userExists = await _context.Users.AnyAsync(u => u.Id == collection.UserId);
            if (!userExists)
                return NotFound("Përdoruesi nuk ekziston.");

            collection.CreatedAt = DateTime.UtcNow; // Shto datën e krijimit
            _context.Collections.Add(collection);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCollectionsByUser), new { userId = collection.UserId }, collection);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Gabim gjatë krijimit të koleksionit: {ex.Message}");
        }
    }

    // PUT: /api/collections/{id}
    [HttpPut("{id}")]
    [Authorize(Roles = "User")] // Vetëm përdoruesit mund të përditësojnë koleksionet
    public async Task<IActionResult> UpdateCollection(int id, [FromBody] Collection updatedCollection)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var existingCollection = await _context.Collections
                .Include(c => c.Products)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (existingCollection == null)
                return NotFound("Koleksioni nuk u gjet.");

            // Përditëso të dhënat
            existingCollection.Name = updatedCollection.Name;
            existingCollection.Description = updatedCollection.Description;
            existingCollection.Products = updatedCollection.Products;

            await _context.SaveChangesAsync();

            return Ok("Koleksioni u përditësua me sukses.");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Gabim gjatë përditësimit të koleksionit: {ex.Message}");
        }
    }

    // DELETE: /api/collections/{id}
    [HttpDelete("{id}")]
    [Authorize(Roles = "User")] // Vetëm përdoruesit mund të fshijnë koleksionet
    public async Task<IActionResult> DeleteCollection(int id)
    {
        try
        {
            var collection = await _context.Collections
                .Include(c => c.Products) // Përfshi produktet për fshirje kaskadë
                .FirstOrDefaultAsync(c => c.Id == id);

            if (collection == null)
                return NotFound("Koleksioni nuk u gjet.");

            _context.Collections.Remove(collection);
            await _context.SaveChangesAsync();

            return Ok("Koleksioni u fshi me sukses.");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Gabim gjatë fshirjes së koleksionit: {ex.Message}");
        }
    }
}
