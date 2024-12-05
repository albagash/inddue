using INDUENDUM_API.Identity.Models;
using INDUENDUM_API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IConfiguration _configuration;

    public AuthController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IConfiguration configuration)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
    }

    // POST: /api/auth/register
    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register([FromBody] RegisterModel model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Kontrollo nëse përdoruesi ekziston
        var existingUser = await _userManager.FindByEmailAsync(model.Email);
        if (existingUser != null)
        {
            return Conflict(new { message = "Përdoruesi me këtë email tashmë ekziston." });
        }

        var user = new ApplicationUser
        {
            UserName = model.Email,
            Email = model.Email,
            FullName = model.FullName
        };

        var result = await _userManager.CreateAsync(user, model.Password);

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        // Shto rolin nëse është specifikuar
        if (!string.IsNullOrEmpty(model.Role))
        {
            var roleExists = await _userManager.IsInRoleAsync(user, model.Role);
            if (!roleExists)
            {
                await _userManager.AddToRoleAsync(user, model.Role);
            }
        }

        return Ok(new { message = "Përdoruesi u regjistrua me sukses." });
    }

    // POST: /api/auth/login
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
        {
            return Unauthorized(new { message = "Email ose fjalëkalim i pasaktë." });
        }

        var token = await GenerateJwtTokenAsync(user); // Rregullimi i `await`

        return Ok(new { token });
    }

    private async Task<string> GenerateJwtTokenAsync(ApplicationUser user) // Rregullimi i `async`
    {
        var securityKey = _configuration["Jwt:Key"];
        if (string.IsNullOrEmpty(securityKey))
        {
            throw new InvalidOperationException("JWT Key is not set in the configuration.");
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(securityKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Email ?? string.Empty),
            new Claim(ClaimTypes.Name, user.UserName ?? string.Empty),
            new Claim("FullName", user.FullName ?? string.Empty),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        // Shto rolet e përdoruesit
        var roles = await _userManager.GetRolesAsync(user); // Shtimi i `await`
        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

// Modelet për regjistrim dhe kyçje
public class RegisterModel
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string Password { get; set; } = string.Empty;

    [Required]
    public string FullName { get; set; } = string.Empty;

    public string Role { get; set; } = "User"; // Default
}

public class LoginModel
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}
