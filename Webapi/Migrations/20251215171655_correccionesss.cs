using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Webapi.Migrations
{
    /// <inheritdoc />
    public partial class correccionesss : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Movimientos_Cuentas_CuentasId",
                table: "Movimientos");

            migrationBuilder.AlterColumn<int>(
                name: "CuentasId",
                table: "Movimientos",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AddForeignKey(
                name: "FK_Movimientos_Cuentas_CuentasId",
                table: "Movimientos",
                column: "CuentasId",
                principalTable: "Cuentas",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Movimientos_Cuentas_CuentasId",
                table: "Movimientos");

            migrationBuilder.AlterColumn<int>(
                name: "CuentasId",
                table: "Movimientos",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Movimientos_Cuentas_CuentasId",
                table: "Movimientos",
                column: "CuentasId",
                principalTable: "Cuentas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
