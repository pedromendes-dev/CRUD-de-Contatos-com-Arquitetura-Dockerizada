using CrudContatos.src.Domain.Entities;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers(); 
builder.Services.AddEndpointsApiExplorer(); 
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<Contatos.src.API.Services.ContatoService>();

// Configurar CORS para aceitar requisições do frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

// Use PostgreSQL em produção, SQL Server em desenvolvimento/docker
builder.Services.AddDbContext<AppDbContext>(options =>
{
    var env = builder.Environment;
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    
    if (env.IsProduction())
    {
        options.UseNpgsql(connectionString);
    }
    else
    {
        options.UseSqlServer(connectionString);
    }
});

var app = builder.Build();

// Usar CORS antes dos outros middlewares
app.UseCors("AllowAll");

app.UseSwagger();
app.UseSwaggerUI();

app.UseAuthorization();
app.MapControllers();
app.Run();
