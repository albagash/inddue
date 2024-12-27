using INDUENDUM_API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Çdo endpoint kërkon autentifikim
public class UsersController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;

    public UsersController(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    // GET: /api/users
    [HttpGet]
    [Authorize(Roles = "Admin")] // Vetëm Admin-i mund të marrë listën e përdoruesve
    public async Task<IActionResult> GetAllUsers()
    {
        try
        {
            var users = await _userManager.Users
                .Select(user => new
                {
                    user.Id,
                    user.UserName,
                    user.Email,
                    user.FullName
                })
                .ToListAsync(); // Merr listën e përdoruesve nga UserManager
            return Ok(users);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Gabim i brendshëm gjatë marrjes së përdoruesve: {ex.Message}");
        }
    }

    // POST: /api/users
    [HttpPost]
    [AllowAnonymous] // Lejon krijimin e përdoruesve pa autentifikim
    public async Task<IActionResult> CreateUser([FromBody] RegisterUserModel model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            // Kontrollo nëse email-i ekziston
            var userExists = await _userManager.FindByEmailAsync(model.Email);
            if (userExists != null)
                return Conflict(new { message = "Ky email është tashmë i regjistruar." });

            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                FullName = model.FullName
            };

            // Krijo përdoruesin me fjalëkalimin e tij
            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                return BadRequest(new { message = $"Gabime gjatë krijimit të përdoruesit: {errors}" });
            }

            // Shto rolin default 'User' nëse nuk specifikohet ndonjë tjetër
            if (string.IsNullOrEmpty(model.Role))
            {
                model.Role = "User";
            }

            if (await _userManager.IsInRoleAsync(user, model.Role) == false)
            {
                await _userManager.AddToRoleAsync(user, model.Role);
            }

            return CreatedAtAction(nameof(GetAllUsers), new { id = user.Id }, new
            {
                user.Id,
                user.UserName,
                user.Email,
                user.FullName,
                Role = model.Role
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Gabim i brendshëm gjatë krijimit të përdoruesit: {ex.Message}");
        }
    }

    // DELETE: /api/users/{id}
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")] // Vetëm admini mund të fshijë përdorues
    public async Task<IActionResult> DeleteUser(string id)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound(new { message = "Përdoruesi nuk u gjet." });

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                return BadRequest(new { message = $"Gabime gjatë fshirjes së përdoruesit: {errors}" });
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Gabim i brendshëm gjatë fshirjes së përdoruesit: {ex.Message}");
        }
    }

    // PUT: /api/users/{id}
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserModel model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
        {
            return NotFound(new { message = "Përdoruesi nuk u gjet." });
        }

        user.FullName = model.FullName;
        user.Email = model.Email;

        var emailUpdateResult = await _userManager.UpdateAsync(user);
        if (!emailUpdateResult.Succeeded)
        {
            return BadRequest(new { message = "Gabim gjatë përditësimit të përdoruesit." });
        }

        var currentRoles = await _userManager.GetRolesAsync(user);
        if (!currentRoles.Contains(model.Role))
        {
            await _userManager.RemoveFromRolesAsync(user, currentRoles);
            await _userManager.AddToRoleAsync(user, model.Role);
        }

        return Ok(new
        {
            id = user.Id,
            fullName = user.FullName,
            email = user.Email,
            role = model.Role
        });
    }


    // Modeli për përditësimin e përdoruesit
    public class UpdateUserModel
    {
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? Role { get; set; } // Roli opsional
    }

}

// Modeli për regjistrimin e përdoruesit
public class RegisterUserModel
{
    [Required(ErrorMessage = "Email-i është i detyrueshëm.")]
    [EmailAddress(ErrorMessage = "Ju lutemi vendosni një email të vlefshëm.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Fjalëkalimi është i detyrueshëm.")]
    [MinLength(6, ErrorMessage = "Fjalëkalimi duhet të ketë të paktën 6 karaktere.")]
    public string Password { get; set; } = string.Empty;

    [Required(ErrorMessage = "Emri i plotë është i detyrueshëm.")]
    public string FullName { get; set; } = string.Empty;

    public string? Role { get; set; } // Roli opsional (default = User)
}
