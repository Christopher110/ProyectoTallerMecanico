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
    public class CustomersController : ControllerBase
    {
        private readonly AppDbContext _db;
        public CustomersController(AppDbContext db) { _db = db; }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] string? q, int page = 1, int pageSize = 20)
        {
            var query = _db.Customers.AsQueryable();
            if (!string.IsNullOrWhiteSpace(q))
                query = query.Where(c => c.FullName.Contains(q) || (c.Email ?? "").Contains(q) || (c.Phone ?? "").Contains(q));

            var total = await query.CountAsync();
            var items = await query.OrderByDescending(c => c.CreatedAt)
                                   .Skip((page - 1) * pageSize)
                                   .Take(pageSize)
                                   .ToListAsync();
            return Ok(new { total, items });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CustomerCreateDto dto)
        {
            var c = new Customer { FullName = dto.FullName, Phone = dto.Phone, Email = dto.Email, Address = dto.Address };
            _db.Customers.Add(c);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = c.Id }, c);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var c = await _db.Customers.Include(x => x.Vehicles).FirstOrDefaultAsync(x => x.Id == id);
            return c == null ? NotFound() : Ok(c);
        }
    }
}