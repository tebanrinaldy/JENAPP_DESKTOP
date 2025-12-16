using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Webapi.Data;
using Webapi.Models;

namespace Webapi.Controllers
{
    [ApiController]
    [Route("api/movimientos")]
    [Authorize]
    public class MovimientosController : ControllerBase
    {
        private readonly Connectioncontextdb _context;

        public MovimientosController(Connectioncontextdb context)
        {
            _context = context;
        }

        // POST: api/movimientos
        [HttpPost]
        public async Task<IActionResult> Crear(Movimientos movimiento)
        {
            if (movimiento.Monto <= 0)
                return BadRequest("El monto debe ser mayor a cero.");

            movimiento.Tipo = movimiento.Tipo.ToUpper().Trim();

            if (movimiento.Tipo != "INGRESO" && movimiento.Tipo != "ENVIO")
                return BadRequest("Tipo inválido.");

            var cuentaExiste = await _context.Cuentas
                .AnyAsync(c => c.Id == movimiento.IdCuenta);

            if (!cuentaExiste)
                return BadRequest("La cuenta no existe.");

            movimiento.Fecha = DateTime.Now;

            if (movimiento.Tipo == "ENVIO")
                movimiento.Estado = true;

            _context.Movimientos.Add(movimiento);
            await _context.SaveChangesAsync();

            return Ok(movimiento);
        }


        // GET: api/movimientos?fecha=YYYY-MM-DD
        [HttpGet]
        public async Task<IActionResult> Listar(DateTime? fecha)
        {
            var dia = fecha ?? DateTime.Today;

            var movimientos = await _context.Movimientos
                .Include(m => m.Cuentas)
                .Where(m => m.Fecha.Date == dia.Date)
                .OrderByDescending(m => m.Id)
                .ToListAsync();

            return Ok(movimientos);
        }

        // PUT: api/movimientos/{id}/reclamar
        [HttpPut("{id}/reclamar")]
        public async Task<IActionResult> Reclamar(int id)
        {
            var movimiento = await _context.Movimientos.FindAsync(id);

            if (movimiento == null)
                return NotFound();

            if (movimiento.Tipo != "INGRESO")
                return BadRequest("Solo ingresos pueden reclamarse.");

            if (movimiento.Estado)
                return BadRequest("Ya está reclamado.");

            movimiento.Estado = true;
            await _context.SaveChangesAsync();

            return Ok(movimiento);
        }
    }
}
