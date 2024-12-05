using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace INDUENDUM_API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAdRequestModel2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Collections_AspNetUsers_UserId",
                table: "Collections");

            migrationBuilder.DropColumn(
                name: "IsApproved",
                table: "AdRequests");

            migrationBuilder.RenameColumn(
                name: "RequestDetails",
                table: "AdRequests",
                newName: "Description");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "Collections",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETUTCDATE()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddColumn<DateTime>(
                name: "EndDate",
                table: "AdRequests",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<decimal>(
                name: "Price",
                table: "AdRequests",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<DateTime>(
                name: "StartDate",
                table: "AdRequests",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "AdRequests",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "AdRequests",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_Collections_AspNetUsers_UserId",
                table: "Collections",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Collections_AspNetUsers_UserId",
                table: "Collections");

            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "AdRequests");

            migrationBuilder.DropColumn(
                name: "Price",
                table: "AdRequests");

            migrationBuilder.DropColumn(
                name: "StartDate",
                table: "AdRequests");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "AdRequests");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "AdRequests");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "AdRequests",
                newName: "RequestDetails");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "Collections",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "GETUTCDATE()");

            migrationBuilder.AddColumn<bool>(
                name: "IsApproved",
                table: "AdRequests",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddForeignKey(
                name: "FK_Collections_AspNetUsers_UserId",
                table: "Collections",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
