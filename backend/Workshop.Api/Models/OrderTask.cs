namespace Workshop.Api.Models
{
    public enum TaskStatus { Pending, Assigned, InProgress, Paused, Done }

    public class OrderTask
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid ServiceOrderId { get; set; }
        public ServiceOrder? ServiceOrder { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public TaskStatus Status { get; set; } = TaskStatus.Pending;
        public Guid? AssigneeId { get; set; }
        public double? HoursSpent { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}