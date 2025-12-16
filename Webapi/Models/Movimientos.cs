namespace Webapi.Models
{
    public class Movimientos
    {
        public int Id { get; set; }
        public int IdCuenta { get; set; }
        public Cuentas? Cuentas { get; set; } = null!;
        public string Tipo { get; set; } = "INGRESO";
        public decimal Monto { get; set; }
        public string? Descripcion { get; set; }
        public DateTime Fecha { get; set; } = DateTime.Now;
        public bool Estado { get; set; } = false;
    }
}
