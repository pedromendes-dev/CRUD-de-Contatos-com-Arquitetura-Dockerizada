using CrudContatos.src.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Npgsql.EntityFrameworkCore.PostgreSQL;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers(); 
builder.Services.AddEndpointsApiExplorer(); 
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<Contatos.src.API.Services.ContatoService>();

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


// Banco qlServer, usando a conecttionString

//builder.Services.AddDbContext<AppDbContext>(options =>
//    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


var app = builder.Build();
// Para expor o Swagger em todos os ambientes, deixe assim:
app.UseSwagger();
app.UseSwaggerUI();


// Restringir o Swagger apenas para desenvolvimento, basta descomentar abaixo:

// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger()
//     app.UseSwaggerUI();
// }

app.UseAuthorization();
app.MapControllers();
app.Run();
