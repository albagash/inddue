using System.ComponentModel.DataAnnotations;

namespace INDUENDUM_API.Models
{
    public class UpdateUserModel
    {
        [Required(ErrorMessage = "Emri i plotë është i detyrueshëm.")]
        public string FullName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email-i është i detyrueshëm.")]
        [EmailAddress(ErrorMessage = "Ju lutem vendosni një email të vlefshëm.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Roli është i detyrueshëm.")]
        public string Role { get; set; } = string.Empty;
    }
}
