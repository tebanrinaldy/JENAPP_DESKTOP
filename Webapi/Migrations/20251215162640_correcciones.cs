using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Webapi.Migrations
{
    /// <inheritdoc />
    public partial class correcciones : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Cliente",
                table: "Movimientos");

            migrationBuilder.AlterColumn<string>(
                name: "Descripcion",
                table: "Movimientos",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Descripcion",
                table: "Movimientos",
                type: "TEXT",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Cliente",
                table: "Movimientos",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }
    }
}
