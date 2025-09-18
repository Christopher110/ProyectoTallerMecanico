using System.ComponentModel.DataAnnotations;

namespace Workshop.Api.Models
{
    public class Customer
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        [Required, MaxLength(150)]
        public string FullName { get; set; } = string.Empty;
        [MaxLength(50)]
        public string? Phone { get; set; }
        [MaxLength(200), EmailAddress]
        public string? Email { get; set; }
        public string? Address { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Vehicle> Vehicles { get; set; } = new List<Vehicle>();
    }
}