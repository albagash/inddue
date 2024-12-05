using System.ComponentModel.DataAnnotations;

namespace INDUENDUM_API.Identity.Models
{
    public class RegisterUserModel
    {
        [Required(ErrorMessage = "Email-i është i detyrueshëm.")]
        [EmailAddress(ErrorMessage = "Ju lutemi vendosni një email të vlefshëm.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Fjalëkalimi është i detyrueshëm.")]
        [DataType(DataType.Password)]
        [MinLength(6, ErrorMessage = "Fjalëkalimi duhet të ketë të paktën 6 karaktere.")]
        [MaxLength(100, ErrorMessage = "Fjalëkalimi nuk mund të jetë më shumë se 100 karaktere.")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "Emri i plotë është i detyrueshëm.")]
        [StringLength(100, ErrorMessage = "Emri i plotë nuk mund të jetë më shumë se 100 karaktere.")]
        public string FullName { get; set; } = string.Empty;

        [RegularExpression("^(Admin|User|Company|Consumer)?$", ErrorMessage = "Roli duhet të jetë 'Admin', 'User', 'Company' ose 'Consumer'.")]
        public string? Role { get; set; } = "Consumer"; // Default role nëse nuk caktohet
    }
}
