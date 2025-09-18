namespace Workshop.Api.Models
{
    public class AuditLog
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Entity { get; set; } = string.Empty;
        public string EntityId { get; set; } = string.Empty;
        public string Action { get; set; } = string.Empty;
        public Guid? ActorId { get; set; }
        public string? Ip { get; set; }
        public DateTime Ts { get; set; } = DateTime.UtcNow;
        public string? Detail { get; set; }
    }
}