using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Workshop.Api.Data;
using Workshop.Api.DTOs;
using Workshop.Api.Models;

namespace Workshop.Api.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    [Authorize]
    public class ServiceOrdersController : ControllerBase
    {
        private readonly AppDbContext _db;
        public ServiceOrdersController(AppDbContext db) { _db = db; }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ServiceOrderCreateDto dto)
        {
            var existsVehicle = await _db.Vehicles.AnyAsync(v => v.Id == dto.VehicleId);
            if (!existsVehicle) return BadRequest("Vehicle not found");

            var order = new ServiceOrder
            {
                VehicleId = dto.VehicleId,
                Odometer = dto.Odometer,
                ReceptionNotes = dto.ReceptionNotes,
                State = OrderState.Draft
            };
            _db.ServiceOrders.Add(order);
            await _db.SaveChangesAsync();
            return Ok(order);
        }

        [HttpGet]
        public async Task<IActionResult> List([FromQuery] OrderState? state, int page = 1, int pageSize = 20)
        {
            var q = _db.ServiceOrders.Include(o => o.Vehicle).ThenInclude(v => v!.Customer).AsQueryable();
            if (state != null) q = q.Where(o => o.State == state);
            var total = await q.CountAsync();
            var items = await q.OrderByDescending(o => o.CreatedAt).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
            return Ok(new { total, items });
        }

        [HttpPatch("{id}/state")]
        public async Task<IActionResult> ChangeState(Guid id, [FromBody] OrderState state)
        {
            var order = await _db.ServiceOrders.FindAsync(id);
            if (order == null) return NotFound();
            order.State = state;
            await _db.SaveChangesAsync();
            return Ok(order);
        }
    }
}