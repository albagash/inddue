using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace INDUENDUM_API.Models
{
    public class ApplicationUser : IdentityUser
    {
        // Emri i plotë i përdoruesit
        [PersonalData]
        [Required(ErrorMessage = "Emri i plotë është i detyrueshëm.")]
        [StringLength(100, ErrorMessage = "Emri i plotë mund të jetë deri në 100 karaktere.")]
        public string FullName { get; set; } = string.Empty;

        // Adresa e përdoruesit (opsionale)
        [PersonalData]
        [StringLength(200, ErrorMessage = "Adresa mund të jetë deri në 200 karaktere.")]
        public string? Address { get; set; }

        // Data e lindjes së përdoruesit (opsionale)
        [PersonalData]
        public DateTime? DateOfBirth { get; set; }

        // Numri i telefonit sekondar (opsionale)
        [PersonalData]
        [Phone(ErrorMessage = "Numri i telefonit nuk është valid.")]
        [StringLength(20, ErrorMessage = "Numri i telefonit mund të jetë deri në 20 karaktere.")]
        public string? SecondaryPhoneNumber { get; set; }

        // URL e fotografisë së profilit (opsionale)
        [PersonalData]
        [Url(ErrorMessage = "URL-ja nuk është valide.")]
        [StringLength(255, ErrorMessage = "URL-ja mund të jetë deri në 255 karaktere.")]
        public string? ProfilePictureUrl { get; set; }
    }
}
