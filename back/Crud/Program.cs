using CrudContatos.src.Domain.Entities;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddScoped<Contatos.src.API.Services.ContatoService>();


builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();
  // Para expor o Swagger em todos os ambientes, deixe assim:
    app.UseSwagger();
    app.UseSwaggerUI();
    
    // Caso queira restringir o Swagger apenas para desenvolvimento, basta descomentar abaixo:
    
    // if (app.Environment.IsDevelopment())
    // {
    //     app.UseSwagger();
    //     app.UseSwaggerUI();
    // }

app.UseAuthorization();
app.MapControllers();
app.Run();