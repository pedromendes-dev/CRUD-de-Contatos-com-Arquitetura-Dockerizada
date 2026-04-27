using CrudContatos.Domain.Service;
using CrudContatos.Infra.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Adiciona controllers
builder.Services.AddControllers();

// Adiciona e configura o Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configura��o do banco de dados SQL Server
builder.Services.AddDbContext<AppDbContext>(options =>
{
    // Coment�rio importante: string de conex�o definida no appsettings.json
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    options.UseSqlServer(connectionString);
});

// Configurar CORS para aceitar requisi��es do frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader());
});

// Injeta o servi�o de contatos
builder.Services.AddScoped<ContatoService>();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.UseDeveloperExceptionPage();

// Usar CORS antes dos outros middlewares
app.UseCors("AllowAll");

app.UseAuthorization();
app.MapControllers();

app.Run();
