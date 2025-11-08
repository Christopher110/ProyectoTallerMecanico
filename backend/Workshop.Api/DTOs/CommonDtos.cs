using System.ComponentModel.DataAnnotations;

namespace Workshop.Api.DTOs
{
    public class CustomerCreateDto
    {
        [Required, MaxLength(150)]
        public string FullName { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? Address { get; set; }
    }

    public class VehicleCreateDto
    {
        [Required] public string Plate { get; set; } = string.Empty;
        public string? Brand { get; set; }
        public string? Model { get; set; }
        public int? Year { get; set; }
        public Guid CustomerId { get; set; }
    }

    public class ServiceOrderCreateDto
    {
        public Guid VehicleId { get; set; }
        public int? Odometer { get; set; }
        public string? ReceptionNotes { get; set; }
    }

    public class AppointmentCreateDto
    {
        public string CustomerName { get; set; }
        public string CustomerPhone { get; set; }
        public string Plates { get; set; } = string.Empty;
        public string? ServicesForVehicle { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string? PaymentMethod { get; set; }
    }
}