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
    public class AppointmentsController : ControllerBase
    {
        private readonly AppDbContext _db;
        public AppointmentsController(AppDbContext db) { _db = db; }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] string? q, int page = 1, int pageSize = 20)
        {
            var query = _db.Appointments.AsQueryable();
            if (!string.IsNullOrWhiteSpace(q))
                query = query.Where(c => c.CustomerName.Contains(q) || (c.CustomerPhone ?? "").Contains(q) || (c.Plates ?? "").Contains(q));

            var total = await query.CountAsync();
            var items = await query.OrderByDescending(c => c.AppointmentDate)
                                   .Skip((page - 1) * pageSize)
                                   .Take(pageSize)
                                   .ToListAsync();
            return Ok(new { total, items });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] AppointmentCreateDto dto)
        {
            var c = new Appointment
            { 
                CustomerName = dto.CustomerName,
                CustomerPhone = dto.CustomerPhone,
                Plates = dto.Plates,
                ServicesForVehicle = dto.ServicesForVehicle,
                AppointmentDate = dto.AppointmentDate,
                PaymentMethod = dto.PaymentMethod 
            };
            _db.Appointments.Add(c);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = c.Id }, c);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var c = await _db.Appointments.Include(x => x.CustomerName).FirstOrDefaultAsync(x => x.Id == id);
            return c == null ? NotFound() : Ok(c);
        }
    }
}