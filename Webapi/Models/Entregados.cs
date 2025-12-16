namespace Webapi.Models
{
    public class Entregados
    {
        public int Id { get; set; }
        public string Metodo { get; set; }
        public decimal Valor { get; set; }
        public DateTime Fecha { get; set; } = DateTime.Now;
    }
}
