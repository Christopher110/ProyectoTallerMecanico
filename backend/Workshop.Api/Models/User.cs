using System.ComponentModel.DataAnnotations;

namespace Workshop.Api.Models
{
    public class User
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        [Required, MaxLength(120)]
        public string Name { get; set; } = string.Empty;
        [Required, EmailAddress, MaxLength(200)]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = "Recepcionista"; // Admin, Recepcionista, Mecanico, Gerente
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}