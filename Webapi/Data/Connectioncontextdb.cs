using Microsoft.EntityFrameworkCore;
using Webapi.Models;
using Webapi.Models.Fiados;

namespace Webapi.Data
{
    public class Connectioncontextdb: DbContext
    {
        public Connectioncontextdb(DbContextOptions<Connectioncontextdb> options) : base(options)
        {
        }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; } 
        public DbSet<Sale> Sales { get; set; }
        public DbSet<SaleDetail> SaleDetails { get; set; }
        public DbSet<Recibidos> Recibidos { get; set; }
        public DbSet<Entregados> Entregados { get; set; }
        public DbSet<Cuentas> Cuentas { get; set; }
        public DbSet<Movimientos> Movimientos { get; set; }
        public DbSet<ClienteFiado> ClientesFiados { get; set; }
        public DbSet<MovimientoFiado> MovimientosFiados { get; set; }
        public DbSet<Acceso> Accesos { get; set; }

        public DbSet<Webapi.Models.InventoryMovement> InventoryMovement { get; set; } = default!;

    }

}
