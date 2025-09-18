using Microsoft.EntityFrameworkCore;
using Workshop.Api.Models;

namespace Workshop.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Role> Roles => Set<Role>();
        public DbSet<Customer> Customers => Set<Customer>();
        public DbSet<Vehicle> Vehicles => Set<Vehicle>();
        public DbSet<ServiceOrder> ServiceOrders => Set<ServiceOrder>();
        public DbSet<Diagnostic> Diagnostics => Set<Diagnostic>();
        public DbSet<OrderTask> OrderTasks => Set<OrderTask>();
        public DbSet<Part> Parts => Set<Part>();
        public DbSet<InventoryMovement> InventoryMovements => Set<InventoryMovement>();
        public DbSet<Appointment> Appointments => Set<Appointment>();
        public DbSet<Invoice> Invoices => Set<Invoice>();
        public DbSet<Payment> Payments => Set<Payment>();
        public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email).IsUnique();

            modelBuilder.Entity<Vehicle>()
                .HasIndex(v => v.Plate).IsUnique();

            modelBuilder.Entity<ServiceOrder>()
                .HasOne(o => o.Vehicle)
                .WithMany(v => v.ServiceOrders)
                .HasForeignKey(o => o.VehicleId);

            modelBuilder.Entity<OrderTask>()
                .HasOne(t => t.ServiceOrder)
                .WithMany(o => o.Tasks)
                .HasForeignKey(t => t.ServiceOrderId);

            modelBuilder.Entity<Diagnostic>()
                .HasOne(d => d.ServiceOrder)
                .WithMany(o => o.Diagnostics)
                .HasForeignKey(d => d.ServiceOrderId);

            modelBuilder.Entity<InventoryMovement>()
                .HasOne(m => m.Part)
                .WithMany(p => p.Movements)
                .HasForeignKey(m => m.PartId);

            modelBuilder.Entity<Invoice>()
                .HasOne(i => i.ServiceOrder)
                .WithMany(o => o.Invoices)
                .HasForeignKey(i => i.ServiceOrderId);

            modelBuilder.Entity<Payment>()
                .HasOne(p => p.Invoice)
                .WithMany(i => i.Payments)
                .HasForeignKey(p => p.InvoiceId);
        }
    }
}
