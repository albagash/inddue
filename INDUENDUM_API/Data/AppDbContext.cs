using Microsoft.EntityFrameworkCore;
using INDUENDUM_API.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace INDUENDUM_API.Data
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Product> Products { get; set; }
        public DbSet<Collection> Collections { get; set; }
        public DbSet<AdRequest> AdRequests { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Konfiguro çmimin për Product
            modelBuilder.Entity<Product>()
                .Property(p => p.Price)
                .HasColumnType("decimal(18, 2)")
                .IsRequired();

            // Relacioni Many-to-Many midis Collection dhe Product
            modelBuilder.Entity<Collection>()
                .HasMany(c => c.Products)
                .WithMany(p => p.Collections)
                .UsingEntity(j => j.ToTable("CollectionProducts"));

            // Relacioni One-to-Many midis Collection dhe ApplicationUser (UserId)
            modelBuilder.Entity<Collection>()
                .HasOne(c => c.User)
                .WithMany()
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Relacioni One-to-Many midis Product dhe ApplicationUser (Company)
            modelBuilder.Entity<Product>()
                .HasOne(p => p.Company)
                .WithMany()
                .HasForeignKey(p => p.CompanyId)
                .OnDelete(DeleteBehavior.Restrict); // Parandalon fshirjen kaskadë

            // Relacioni One-to-Many midis AdRequest dhe ApplicationUser (Company)
            modelBuilder.Entity<AdRequest>()
                .HasOne(ar => ar.Company)
                .WithMany()
                .HasForeignKey(ar => ar.CompanyId)
                .OnDelete(DeleteBehavior.Restrict); // Parandalon fshirjen kaskadë

            // Default value për CreatedAt në Product
            modelBuilder.Entity<Product>()
                .Property(p => p.CreatedAt)
                .HasColumnType("datetime2")
                .HasDefaultValueSql("GETUTCDATE()");

            // Default value dhe konfigurimi për UpdatedAt në Product
            modelBuilder.Entity<Product>()
                .Property(p => p.UpdatedAt)
                .HasColumnType("datetime2")
                .ValueGeneratedOnAddOrUpdate();

            // Default value për CreatedAt në Collection
            modelBuilder.Entity<Collection>()
                .Property(c => c.CreatedAt)
                .HasColumnType("datetime2")
                .HasDefaultValueSql("GETUTCDATE()");

            // Default value dhe konfigurimi për UpdatedAt në Collection
            modelBuilder.Entity<Collection>()
                .Property(c => c.UpdatedAt)
                .HasColumnType("datetime2")
                .ValueGeneratedOnAddOrUpdate();

            // Default value për CreatedAt në AdRequest
            modelBuilder.Entity<AdRequest>()
                .Property(ar => ar.CreatedAt)
                .HasColumnType("datetime2")
                .HasDefaultValueSql("GETUTCDATE()");

            // Default value dhe konfigurimi për UpdatedAt në AdRequest
            modelBuilder.Entity<AdRequest>()
                .Property(ar => ar.UpdatedAt)
                .HasColumnType("datetime2")
                .ValueGeneratedOnAddOrUpdate();
        }
    }
}
