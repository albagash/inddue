using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INDUENDUM_API.Models
{
    public class AdRequest
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Titulli është i detyrueshëm.")]
        [StringLength(200, ErrorMessage = "Titulli duhet të jetë maksimumi 200 karaktere.")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Përshkrimi është i detyrueshëm.")]
        [StringLength(500, ErrorMessage = "Përshkrimi duhet të jetë maksimumi 500 karaktere.")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "Data e fillimit është e detyrueshme.")]
        [Column(TypeName = "datetime2")]
        public DateTime StartDate { get; set; }

        [Required(ErrorMessage = "Data e përfundimit është e detyrueshme.")]
        [Column(TypeName = "datetime2")]
        public DateTime EndDate { get; set; }

        [Required(ErrorMessage = "ID e kompanisë është e detyrueshme.")]
        [ForeignKey(nameof(Company))]
        public string CompanyId { get; set; } = string.Empty;

        public ApplicationUser? Company { get; set; }

        // Shtimi i pronave të reja
        [Required(ErrorMessage = "Statusi është i detyrueshëm.")]
        [StringLength(50, ErrorMessage = "Statusi duhet të jetë maksimumi 50 karaktere.")]
        public string Status { get; set; } = "Pending"; // Default: Në pritje

        [Column(TypeName = "decimal(18, 2)")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Çmimi duhet të jetë më i madh se zero.")]
        public decimal Price { get; set; } // Çmimi i reklamës

        [Column(TypeName = "datetime2")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column(TypeName = "datetime2")]
        public DateTime? UpdatedAt { get; set; } // Mund të jetë null nëse nuk është përditësuar ende
    }
}
