using System.ComponentModel.DataAnnotations;

namespace Workshop.Api.Models
{
    public class Vehicle
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        [Required, MaxLength(15)]
        public string Plate { get; set; } = string.Empty;
        [MaxLength(80)] public string? Brand { get; set; }
        [MaxLength(80)] public string? Model { get; set; }
        public int? Year { get; set; }
        public Guid CustomerId { get; set; }
        public Customer? Customer { get; set; }
        public ICollection<ServiceOrder> ServiceOrders { get; set; } = new List<ServiceOrder>();
    }
}