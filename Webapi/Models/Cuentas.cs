namespace Webapi.Models
{
    public class Cuentas
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public ICollection<Movimientos> Movimientos { get; set; } = new List<Movimientos>();
    }
}
