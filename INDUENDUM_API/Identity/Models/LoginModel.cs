using System.ComponentModel.DataAnnotations;

namespace INDUENDUM_API.Identity.Models
{
    public class LoginModel
    {
        [Required(ErrorMessage = "Email-i është i detyrueshëm.")]
        [EmailAddress(ErrorMessage = "Ju lutemi vendosni një email të vlefshëm.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Fjalëkalimi është i detyrueshëm.")]
        [DataType(DataType.Password)]
        [MinLength(6, ErrorMessage = "Fjalëkalimi duhet të përmbajë të paktën 6 karaktere.")]
        [MaxLength(50, ErrorMessage = "Fjalëkalimi nuk mund të kalojë 50 karaktere.")]
        public string Password { get; set; } = string.Empty;
    }
}
