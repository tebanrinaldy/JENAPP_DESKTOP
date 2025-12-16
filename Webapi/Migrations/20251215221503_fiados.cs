using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Webapi.Migrations
{
    /// <inheritdoc />
    public partial class fiados : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ClientesFiados",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Nombre = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClientesFiados", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MovimientosFiados",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ClienteFiadoId = table.Column<int>(type: "INTEGER", nullable: false),
                    Valor = table.Column<decimal>(type: "TEXT", nullable: false),
                    Descripcion = table.Column<string>(type: "TEXT", nullable: true),
                    Fecha = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MovimientosFiados", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MovimientosFiados_ClientesFiados_ClienteFiadoId",
                        column: x => x.ClienteFiadoId,
                        principalTable: "ClientesFiados",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MovimientosFiados_ClienteFiadoId",
                table: "MovimientosFiados",
                column: "ClienteFiadoId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MovimientosFiados");

            migrationBuilder.DropTable(
                name: "ClientesFiados");
        }
    }
}
