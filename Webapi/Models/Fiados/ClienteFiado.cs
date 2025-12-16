namespace Webapi.Models.Fiados
{
    public class ClienteFiado
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = null!;

        public ICollection<MovimientoFiado> Movimiento { get; set; } = new List<MovimientoFiado>();
    }
}
