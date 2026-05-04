using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CrudContatos.Core.DTOs;
using CrudContatos.Domain.Service.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace CrudContatos.Api.Controllers;

// Controller responsável pela autenticação de administradores.
// Recebe e-mail e senha, valida via AuthService e devolve um JWT assinado.
[ApiController]
[Route("[controller]")]
public class AuthController(IAuthService authService, IConfiguration configuration) : ControllerBase
{
    // POST /Auth/Login — recebe { email, senha } e retorna o JWT se as credenciais forem válidas
    [HttpPost("Login")]
    public IActionResult Login([FromBody] LoginDto dto)
    {
        // Delega a validação das credenciais ao AuthService (lógica de domínio)
        var usuario = authService.ValidarCredenciais(dto.Email, dto.Senha);

        if (usuario == null)
            return Unauthorized(new { message = "E-mail ou senha inválidos." });

        // Lê as configurações JWT do appsettings.json
        var jwtSection = configuration.GetSection("Jwt");
        var secretKey  = jwtSection["SecretKey"]!;
        var issuer     = jwtSection["Issuer"]!;
        var audience   = jwtSection["Audience"]!;
        var expHours   = int.Parse(jwtSection["ExpiresInHours"] ?? "8");

        // Monta os claims que serão embutidos no token
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub,   usuario.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, usuario.Email ?? ""),
            new(JwtRegisteredClaimNames.Jti,   Guid.NewGuid().ToString()), // ID único do token — útil para revogação futura
            new("nome", usuario.Nome ?? ""),
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expiresAt   = DateTime.UtcNow.AddHours(expHours);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: expiresAt,
            signingCredentials: credentials
        );

        return Ok(new AuthResponseDto
        {
            Token = new JwtSecurityTokenHandler().WriteToken(token),
            Nome = usuario.Nome  ?? "",
            Email = usuario.Email ?? "",
            ExpiresAt = expiresAt,
        });
    }
}
