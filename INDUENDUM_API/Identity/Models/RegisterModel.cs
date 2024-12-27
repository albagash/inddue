using System.ComponentModel.DataAnnotations;

namespace INDUENDUM_API.Identity.Models
{
    public class RegisterModel
    {
        [Required(ErrorMessage = "Emri i plotë është i detyrueshëm.")]
        [StringLength(100, ErrorMessage = "Emri i plotë duhet të jetë deri në 100 karaktere.")]
        public string FullName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email-i është i detyrueshëm.")]
        [EmailAddress(ErrorMessage = "Ju lutemi vendosni një email të vlefshëm.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Fjalëkalimi është i detyrueshëm.")]
        [DataType(DataType.Password)]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Fjalëkalimi duhet të jetë të paktën 6 karaktere.")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "Roli është i detyrueshëm.")]
        [RegularExpression("^(Admin|User|Company)$", ErrorMessage = "Roli duhet të jetë Admin, User ose Company.")]
        public string Role { get; set; } = "User";
    }
}
