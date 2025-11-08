using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore;
using Workshop.Api.Data;
using Workshop.Api.DTOs;
using Workshop.Api.Models;

namespace Workshop.Api.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    [Authorize]
    public class VehiclesController : ControllerBase
    {
        private readonly AppDbContext _db;
        public VehiclesController(AppDbContext db) { _db = db; }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] string? q, int page = 1, int pageSize = 20)
        {
            var query = _db.Vehicles.AsQueryable();
            if (!string.IsNullOrWhiteSpace(q))
                query = query.Where(c => c.Plate.Contains(q) || (c.Brand ?? "").Contains(q) || (c.Model ?? "").Contains(q));

            var total = await query.CountAsync();
            var items = await query.OrderByDescending(c => c.Plate)
                                   .Skip((page - 1) * pageSize)
                                   .Take(pageSize)
                                   .ToListAsync();
            return Ok(new { total, items });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] VehicleCreateDto dto)
        {
            var v = new Vehicle { Plate = dto.Plate, Brand = dto.Brand, Model = dto.Model, Year = dto.Year, CustomerId = dto.CustomerId };
            _db.Vehicles.Add(v);
            await _db.SaveChangesAsync();
            return Ok(v);
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string plate)
        {
            var v = await _db.Vehicles
                .Include(x => x.Customer)
                .FirstOrDefaultAsync(x => x.Plate.ToUpper() == plate.Trim().ToUpper());

            if (v != null)
            {
                return Ok(v);
            }
            else
            {
                return NotFound();
            }

            //return v is null ? NotFound() : Ok(v);
        }
    }
}