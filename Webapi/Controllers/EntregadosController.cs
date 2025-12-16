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
    public class EntregadosController : ControllerBase
    {
        private readonly Connectioncontextdb _context;

        public EntregadosController(Connectioncontextdb context)
        {
            _context = context;
        }

        // GET: api/InternetDeliveries
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Entregados>>> GetDeliveries()
        {
            return await _context.Entregados
                .OrderByDescending(d => d.Fecha)
                .ToListAsync();
        }

        // POST: api/InternetDeliveries
        [HttpPost]
        public async Task<ActionResult<Entregados>> PostDelivery(Entregados entregados)
        {
            if (entregados.Valor <= 0)
                return BadRequest("El valor debe ser mayor a cero.");

            if (string.IsNullOrWhiteSpace(entregados.Metodo))
                return BadRequest("Debe especificar el método de entrega.");

            _context.Entregados.Add(entregados);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDeliveries), new { id = entregados.Id }, entregados);
        }
    }
}
