namespace Workshop.Api.Models
{
    public class Appointment
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string CustomerName { get; set; }
        public string CustomerPhone { get; set; }
        public string Plates { get; set; } = string.Empty;
        public string? ServicesForVehicle { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string? PaymentMethod { get; set; }
    }
}