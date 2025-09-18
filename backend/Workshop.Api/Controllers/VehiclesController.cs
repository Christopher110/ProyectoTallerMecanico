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
    public class VehiclesController : ControllerBase
    {
        private readonly AppDbContext _db;
        public VehiclesController(AppDbContext db) { _db = db; }

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
            var v = await _db.Vehicles.Include(x => x.Customer).FirstOrDefaultAsync(x => x.Plate == plate);
            return v == null ? NotFound() : Ok(v);
        }
    }
}