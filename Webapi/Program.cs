using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using QuestPDF.Infrastructure;
using System.Text;
using Webapi;
using Webapi.Data;
using Webapi.Repositories;
using Webapi.Services;

var builder = WebApplication.CreateBuilder(args);

QuestPDF.Settings.License = LicenseType.Community;

var cadenaconexion = builder.Configuration.GetConnectionString("CadenaConexionDB");
builder.Services.AddDbContext<Connectioncontextdb>(options =>
    options.UseSqlite(cadenaconexion));

var permitirtodo = "_permitirtodo";
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirTodo", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.WebHost.UseUrls("http://localhost:5132");


builder.Services.AddScoped<JwtTokensGenerator>();
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<Saleservice>();
builder.Services.AddScoped<Productservice>();
builder.Services.AddScoped<Inventoryservice>();
builder.Services.AddScoped<Reportsservice>();

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["JWTSettings:Key"]))
        };
    });

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    var swaggerUrl = "http://localhost:5132/swagger";
    try
    {
        System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo
        {
            FileName = swaggerUrl,
            UseShellExecute = true
        });
    }
    catch { }
}

app.UseCors("PermitirTodo");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<Connectioncontextdb>();
    db.Database.Migrate();
}

app.Run();
