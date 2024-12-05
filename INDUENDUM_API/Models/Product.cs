using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INDUENDUM_API.Models
{
    public class Product
    {
        // Çelësi primar
        [Key]
        public int Id { get; set; }

        // Emri i produktit
        [Required(ErrorMessage = "Emri i produktit është i detyrueshëm.")]
        [StringLength(100, ErrorMessage = "Emri i produktit duhet të ketë maksimumi 100 karaktere.")]
        public string Name { get; set; } = string.Empty;

        // Përshkrimi i produktit
        [Required(ErrorMessage = "Përshkrimi është i detyrueshëm.")]
        [StringLength(500, ErrorMessage = "Përshkrimi duhet të ketë maksimumi 500 karaktere.")]
        public string Description { get; set; } = string.Empty;

        // Çmimi i produktit
        [Required(ErrorMessage = "Çmimi është i detyrueshëm.")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Çmimi duhet të jetë më i madh se zero.")]
        [Column(TypeName = "decimal(18, 2)")] // Saktëson formatin e çmimit
        public decimal Price { get; set; }

        // URL për imazhin e produktit
        [Required(ErrorMessage = "URL për imazhin është e detyrueshme.")]
        [Url(ErrorMessage = "Ju lutemi vendosni një URL të vlefshme.")]
        [StringLength(255, ErrorMessage = "URL duhet të ketë maksimumi 255 karaktere.")]
        public string ImageUrl { get; set; } = string.Empty;

        // Statusi nëse produkti është në zbritje
        [Required(ErrorMessage = "Statusi për zbritje është i detyrueshëm.")]
        public bool IsOnSale { get; set; } = false; // Default: jo në zbritje

        // ID e kompanisë që menaxhon produktin
        [Required(ErrorMessage = "ID e kompanisë është e detyrueshme.")]
        [ForeignKey(nameof(Company))]
        public string CompanyId { get; set; } = string.Empty;

        // Kompania që lidhet me produktin
        public ApplicationUser? Company { get; set; }

        // Koleksionet që lidhen me produktin (Many-to-Many)
        public ICollection<Collection> Collections { get; set; } = new List<Collection>();

        // Data e krijimit për auditim
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column(TypeName = "datetime2")] // Sigurohemi që formati të jetë datetime2
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Data e përditësimit për auditim
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        [Column(TypeName = "datetime2")] // Sigurohemi që formati të jetë datetime2
        public DateTime? UpdatedAt { get; set; }
    }
}

