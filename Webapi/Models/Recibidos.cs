namespace Webapi.Models
{
    public class Recibidos
    {
        public int Id { get; set; }
        public string ClienteNombre { get; set; }
        public decimal Valor { get; set; }  
        public DateTime Fecha { get; set; } = DateTime.Now;

    }
}
