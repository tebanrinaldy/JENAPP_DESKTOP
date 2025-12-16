using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Webapi.Data;
using Webapi.Models;

namespace Webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RecibidosController : ControllerBase
    {
        private readonly Connectioncontextdb _context;

        public RecibidosController(Connectioncontextdb context)
        {
            _context = context;
        }

        // GET: api/recibidos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Recibidos>>> GetPayments()
        {
            return await _context.Recibidos
                .OrderByDescending(p => p.Fecha)
                .ToListAsync();
        }

        // POST: api/recibidos
        [HttpPost]
        public async Task<ActionResult<Recibidos>> PostPayment(Recibidos payment)
        {
            if (payment.Valor <= 0)
                return BadRequest("El valor debe ser mayor a cero.");

            _context.Recibidos.Add(payment);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPayments), new { id = payment.Id }, payment);
        }
    }
}
