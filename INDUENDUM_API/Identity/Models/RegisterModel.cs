using System.ComponentModel.DataAnnotations;

namespace INDUENDUM_API.Identity.Models
{
    public class RegisterModel
    {
        [Required]
        [StringLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; } = string.Empty;

        public string Role { get; set; } = "User";
    }
}
