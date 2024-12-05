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
        [MinLength(6, ErrorMessage = "Fjalëkalimi duhet të ketë të paktën 6 karaktere.")]
        public string Password { get; set; } = string.Empty;
    }
}
