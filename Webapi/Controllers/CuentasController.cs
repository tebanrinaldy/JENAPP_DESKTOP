using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Webapi.Data;
using Webapi.Models;

namespace Webapi.Controllers
{
    [ApiController]
    [Route("api/cuentas")]
    [Authorize]
    public class CuentasController : ControllerBase
    {
        private readonly Connectioncontextdb _context;

        public CuentasController(Connectioncontextdb context)
        {
            _context = context;
        }

        // GET: api/cuentas
        [HttpGet]
        public async Task<IActionResult> GetCuentas()
        {
            var cuentas = await _context.Cuentas
                .OrderBy(c => c.Nombre)
                .ToListAsync();

            return Ok(cuentas);
        }

        // GET: api/cuentas/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCuenta(int id)
        {
            var cuenta = await _context.Cuentas
                .Include(c => c.Movimientos)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (cuenta == null)
                return NotFound();

            return Ok(cuenta);
        }

        // POST: api/cuentas
        [HttpPost]
        public async Task<IActionResult> CrearCuenta(Cuentas cuenta)
        {
            if (string.IsNullOrWhiteSpace(cuenta.Nombre))
                return BadRequest("El nombre de la cuenta es obligatorio.");

            _context.Cuentas.Add(cuenta);
            await _context.SaveChangesAsync();

            return Ok(cuenta);
        }
    }
}
