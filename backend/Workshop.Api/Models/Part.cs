namespace Workshop.Api.Models
{
    public class Part
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Sku { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public decimal UnitCost { get; set; }
        public int Stock { get; set; }
        public int MinStock { get; set; } = 0;
        public ICollection<InventoryMovement> Movements { get; set; } = new List<InventoryMovement>();
    }
}