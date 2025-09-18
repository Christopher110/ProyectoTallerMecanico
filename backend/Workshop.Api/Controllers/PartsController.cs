using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Workshop.Api.Data;
using Workshop.Api.Models;

namespace Workshop.Api.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    [Authorize(Roles="Admin,Gerente")]
    public class PartsController : ControllerBase
    {
        private readonly AppDbContext _db;
        public PartsController(AppDbContext db) { _db = db; }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _db.Parts.OrderBy(p => p.Name).ToListAsync());

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Part part)
        {
            _db.Parts.Add(part);
            await _db.SaveChangesAsync();
            return Ok(part);
        }
    }
}