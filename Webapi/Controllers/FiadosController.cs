using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Webapi.Data;
using Webapi.Models.Fiados;

namespace Webapi.Controllers
{
    [ApiController]
    [Route("api/fiados")]
    [Authorize]
    public class FiadosController : ControllerBase
    {
        private readonly Connectioncontextdb _context;

        public FiadosController(Connectioncontextdb context)
        {
            _context = context;
        }

        [HttpGet("clientes")]
        public IActionResult GetClientes(string? search)
        {
            var query = _context.ClientesFiados.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(c => c.Nombre.Contains(search));

            var clientes = query
                .Include(c => c.Movimiento)
                .OrderBy(c => c.Nombre)
                .AsEnumerable()
                .Select(c => new
                {
                    c.Id,
                    c.Nombre,
                    Total = c.Movimiento.Sum(m => m.Valor)
                })
                .ToList();

            return Ok(clientes);
        }

        [HttpPost("clientes")]
        public async Task<IActionResult> CrearCliente([FromBody] string nombre)
        {
            if (string.IsNullOrWhiteSpace(nombre))
                return BadRequest();

            var existe = await _context.ClientesFiados
                .AnyAsync(c => c.Nombre.ToLower() == nombre.ToLower());

            if (existe)
                return BadRequest();

            var cliente = new ClienteFiado
            {
                Nombre = nombre
            };

            _context.ClientesFiados.Add(cliente);
            await _context.SaveChangesAsync();

            return Ok(cliente);
        }

        [HttpGet("clientes/{id}")]
        public IActionResult GetDetalleCliente(int id)
        {
            var cliente = _context.ClientesFiados
                .Include(c => c.Movimiento)
                .Where(c => c.Id == id)
                .AsEnumerable()
                .Select(c => new
                {
                    c.Id,
                    c.Nombre,
                    Movimientos = c.Movimiento
                        .OrderByDescending(m => m.Fecha)
                        .Select(m => new
                        {
                            m.Id,
                            m.Valor,
                            m.Descripcion,
                            m.Fecha
                        })
                })
                .FirstOrDefault();

            if (cliente == null)
                return NotFound();

            return Ok(cliente);
        }

        [HttpPost("fiado")]
        public async Task<IActionResult> RegistrarFiado(
            int clienteId,
            decimal valor,
            string descripcion)
        {
            if (valor <= 0 || string.IsNullOrWhiteSpace(descripcion))
                return BadRequest();

            var existe = await _context.ClientesFiados
                .AnyAsync(c => c.Id == clienteId);

            if (!existe)
                return NotFound();

            var movimiento = new MovimientoFiado
            {
                ClienteFiadoId = clienteId,
                Valor = valor,
                Descripcion = descripcion
            };

            _context.MovimientosFiados.Add(movimiento);
            await _context.SaveChangesAsync();

            return Ok(movimiento);
        }

        [HttpPost("abono")]
        public async Task<IActionResult> RegistrarAbono(
            int clienteId,
            decimal? valor,
            bool abonoTotal)
        {
            var movimientos = _context.MovimientosFiados
                .Where(m => m.ClienteFiadoId == clienteId)
                .AsEnumerable()
                .ToList();

            var total = movimientos.Sum(m => m.Valor);

            if (total <= 0)
                return BadRequest();

            var monto = abonoTotal ? total : valor ?? 0;

            if (monto <= 0 || monto > total)
                return BadRequest();

            var movimiento = new MovimientoFiado
            {
                ClienteFiadoId = clienteId,
                Valor = -monto
            };

            _context.MovimientosFiados.Add(movimiento);
            await _context.SaveChangesAsync();

            return Ok(movimiento);
        }
    }
}
