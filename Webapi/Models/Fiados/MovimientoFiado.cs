namespace Webapi.Models.Fiados
{
    public class MovimientoFiado
    {
        public int Id { get; set; }
        public int ClienteFiadoId { get; set; }
        public ClienteFiado? ClienteFiado { get; set; } = null!;
        public decimal Valor { get; set; }
        public string? Descripcion { get; set; }
        public DateTime Fecha { get; set; } = DateTime.Now;
    }
}
