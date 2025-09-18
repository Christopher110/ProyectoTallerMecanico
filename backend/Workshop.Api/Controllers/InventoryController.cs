using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Workshop.Api.Data;
using Workshop.Api.Models;

namespace Workshop.Api.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    [Authorize]
    public class InventoryController : ControllerBase
    {
        private readonly AppDbContext _db;
        public InventoryController(AppDbContext db) { _db = db; }

        [HttpPost("movement")]
        public async Task<IActionResult> Movement([FromBody] InventoryMovement m)
        {
            var part = await _db.Parts.FindAsync(m.PartId);
            if (part == null) return BadRequest("Part not found");

            switch (m.Type)
            {
                case MovementType.In: part.Stock += m.Quantity; break;
                case MovementType.Out:
                    if (part.Stock < m.Quantity) return BadRequest("Insufficient stock");
                    part.Stock -= m.Quantity;
                    break;
                case MovementType.Return: part.Stock += m.Quantity; break;
                case MovementType.Adjustment: part.Stock = m.Quantity; break;
            }
            _db.InventoryMovements.Add(m);
            await _db.SaveChangesAsync();
            return Ok(new { part.Stock, movement = m });
        }

        [HttpGet("alerts")]
        public async Task<IActionResult> Alerts()
        {
            var alerts = await _db.Parts.Where(p => p.Stock <= p.MinStock).ToListAsync();
            return Ok(alerts);
        }
    }
}