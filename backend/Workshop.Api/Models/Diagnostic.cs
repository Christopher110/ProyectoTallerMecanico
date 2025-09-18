namespace Workshop.Api.Models
{
    public class Diagnostic
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid ServiceOrderId { get; set; }
        public ServiceOrder? ServiceOrder { get; set; }
        public string Findings { get; set; } = string.Empty;
        public string Recommendations { get; set; } = string.Empty;
        public double? EstimatedHours { get; set; }
        public Guid? TechnicianId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}