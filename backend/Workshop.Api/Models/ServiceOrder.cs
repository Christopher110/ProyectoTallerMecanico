using System.ComponentModel.DataAnnotations;

namespace Workshop.Api.Models
{
    public enum OrderState { Draft, Diagnostic, Quoted, Approved, InProgress, Finished, Closed }

    public class ServiceOrder
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid VehicleId { get; set; }
        public Vehicle? Vehicle { get; set; }
        public OrderState State { get; set; } = OrderState.Draft;
        public int? Odometer { get; set; }
        public string? ReceptionNotes { get; set; }
        public decimal LaborSubtotal { get; set; }
        public decimal PartsSubtotal { get; set; }
        public decimal Taxes { get; set; }
        public decimal Total { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<OrderTask> Tasks { get; set; } = new List<OrderTask>();
        public ICollection<Diagnostic> Diagnostics { get; set; } = new List<Diagnostic>();
        public ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();
    }
}