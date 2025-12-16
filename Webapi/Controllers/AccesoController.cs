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
    public class AccesoController : ControllerBase
    {
        private readonly Connectioncontextdb _context;

        public AccesoController(Connectioncontextdb context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var accesos = await _context.Accesos
                .OrderBy(a => a.Nombre)
                .ToListAsync();

            return Ok(accesos);
        }

        [HttpPost]
        public async Task<IActionResult> Post(Acceso acceso)
        {
            if (string.IsNullOrWhiteSpace(acceso.Nombre))
                return BadRequest("El nombre es obligatorio");

            if (string.IsNullOrWhiteSpace(acceso.Cedula))
                return BadRequest("La cédula es obligatoria");

            if (!acceso.Cedula.All(char.IsDigit))
                return BadRequest("La cédula solo puede contener números");

            acceso.Nombre = acceso.Nombre.ToUpper();

            _context.Accesos.Add(acceso);
            await _context.SaveChangesAsync();

            return Ok(acceso);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, Acceso acceso)
        {
            var db = await _context.Accesos.FindAsync(id);
            if (db == null)
                return NotFound();

            if (string.IsNullOrWhiteSpace(acceso.Nombre))
                return BadRequest("El nombre es obligatorio");

            if (string.IsNullOrWhiteSpace(acceso.Cedula))
                return BadRequest("La cédula es obligatoria");

            if (!acceso.Cedula.All(char.IsDigit))
                return BadRequest("La cédula solo puede contener números");

            db.Nombre = acceso.Nombre.ToUpper();
            db.Cedula = acceso.Cedula;
            db.Contrasena = acceso.Contrasena;

            await _context.SaveChangesAsync();

            return Ok(db);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var acceso = await _context.Accesos.FindAsync(id);
            if (acceso == null)
                return NotFound();

            _context.Accesos.Remove(acceso);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
