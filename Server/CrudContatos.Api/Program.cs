using System.Text;
using CrudContatos.Api.Middlewares;
using CrudContatos.Api.Swagger;
using CrudContatos.Domain.Service;
using CrudContatos.Domain.Service.Interfaces;
using CrudContatos.Infra.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;

var builder = WebApplication.CreateBuilder(args);

// Adiciona controllers
builder.Services.AddControllers();

// Swagger com suporte a JWT Bearer — botão Authorize + cadeado nos endpoints protegidos
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name         = "Authorization",
        Type         = SecuritySchemeType.Http,
        Scheme       = "bearer",
        BearerFormat = "JWT",
        In           = ParameterLocation.Header,
        Description  = "Cole apenas o token JWT obtido em POST /Auth/Login (sem prefixo 'Bearer')"
    });

    options.AddSecurityRequirement(doc => new OpenApiSecurityRequirement
    {
        { new OpenApiSecuritySchemeReference("Bearer", doc), [] }
    });

    options.OperationFilter<AuthorizeOperationFilter>();
});

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

// Configuração de autenticação JWT Bearer
// SecretKey, Issuer e Audience lidos do appsettings.json seção "Jwt"
var jwtSection = builder.Configuration.GetSection("Jwt");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer           = true,
            ValidateAudience         = true,
            ValidateLifetime         = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer              = jwtSection["Issuer"],
            ValidAudience            = jwtSection["Audience"],
            IssuerSigningKey         = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSection["SecretKey"]!)),
            ClockSkew = TimeSpan.Zero // Remove tolerância padrão de 5 min para expiração exata
        };
    });

// Injeta o servi�o de contatos
builder.Services.AddScoped<IContatoService, ContatoService>();

// Injeta o serviço de autenticação
builder.Services.AddScoped<IAuthService, AuthService>();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.UseMiddleware<ExceptionMiddleware>();

// Usar CORS antes dos outros middlewares
app.UseCors("AllowAll");

// UseAuthentication deve vir ANTES de UseAuthorization
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
