namespace Workshop.Api.Models
{
    public class Appointment
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public string Title { get; set; } = string.Empty;
        public Guid? TechnicianId { get; set; }
        public Guid? VehicleId { get; set; }
        public string? Notes { get; set; }
        public bool Confirmed { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}