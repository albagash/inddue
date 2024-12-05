using INDUENDUM_API.Data;
using INDUENDUM_API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AdRequestsController : ControllerBase
{
    private readonly AppDbContext _context;

    public AdRequestsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: /api/adrequests
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllAdRequests()
    {
        try
        {
            var adRequests = await _context.AdRequests
                .Include(ar => ar.Company)
                .ToListAsync();

            return Ok(adRequests);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Gabim gjatë marrjes së të dhënave: {ex.Message}" });
        }
    }

    // POST: /api/adrequests
    [HttpPost]
    [Authorize(Roles = "Company")]
    public async Task<IActionResult> CreateAdRequest([FromBody] AdRequest adRequest)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var companyExists = await _context.Users
                .OfType<ApplicationUser>()
                .AnyAsync(u => u.Id == adRequest.CompanyId);

            if (!companyExists)
                return NotFound(new { message = "Kompania nuk ekziston." });

            adRequest.CreatedAt = DateTime.UtcNow;
            _context.AdRequests.Add(adRequest);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAllAdRequests), new { id = adRequest.Id }, adRequest);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Gabim i brendshëm: {ex.Message}" });
        }
    }

    // PUT: /api/adrequests/{id}
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateAdRequest(int id, [FromBody] AdRequest adRequest)
    {
        if (id != adRequest.Id)
            return BadRequest(new { message = "ID e dhënë nuk përputhet me objektin." });

        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var existingAdRequest = await _context.AdRequests.FindAsync(id);
            if (existingAdRequest == null)
                return NotFound(new { message = "Kërkesa nuk ekziston." });

            existingAdRequest.UpdatedAt = DateTime.UtcNow;
            _context.Entry(existingAdRequest).CurrentValues.SetValues(adRequest);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (DbUpdateConcurrencyException ex)
        {
            return StatusCode(500, new { message = $"Gabim gjatë përditësimit: {ex.Message}" });
        }
    }

    // DELETE: /api/adrequests/{id}
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteAdRequest(int id)
    {
        try
        {
            var adRequest = await _context.AdRequests.FindAsync(id);
            if (adRequest == null)
                return NotFound(new { message = "Kërkesa nuk u gjet." });

            _context.AdRequests.Remove(adRequest);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Gabim gjatë fshirjes: {ex.Message}" });
        }
    }
}