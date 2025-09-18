namespace Workshop.Api.Models
{
    public enum MovementType { In, Out, Return, Adjustment }

    public class InventoryMovement
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid PartId { get; set; }
        public Part? Part { get; set; }
        public MovementType Type { get; set; }
        public int Quantity { get; set; }
        public decimal? UnitCost { get; set; }
        public string? Reason { get; set; }
        public Guid? ServiceOrderId { get; set; }
        public DateTime MovementDate { get; set; } = DateTime.UtcNow;
    }
}