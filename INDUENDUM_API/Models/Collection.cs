using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INDUENDUM_API.Models
{
    public class Collection
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Emri i koleksionit është i detyrueshëm.")]
        [StringLength(100, ErrorMessage = "Emri i koleksionit duhet të jetë deri në 100 karaktere.")]
        public string Name { get; set; } = string.Empty;

        [StringLength(500, ErrorMessage = "Përshkrimi i koleksionit duhet të jetë deri në 500 karaktere.")]
        public string? Description { get; set; } // Përshkrimi opsional i koleksionit

        [Required(ErrorMessage = "Përdoruesi i lidhur është i detyrueshëm.")]
        [ForeignKey(nameof(User))]
        public string UserId { get; set; } = string.Empty;

        public ApplicationUser? User { get; set; } // Përdoruesi i lidhur

        // Relacioni me produktet
        public ICollection<Product> Products { get; set; } = new List<Product>();

        // Data e krijimit (krijohet automatikisht)
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column(TypeName = "datetime2")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Data e përditësimit (përditësohet automatikisht kur editohet koleksioni)
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        [Column(TypeName = "datetime2")]
        public DateTime? UpdatedAt { get; set; }
    }
}
