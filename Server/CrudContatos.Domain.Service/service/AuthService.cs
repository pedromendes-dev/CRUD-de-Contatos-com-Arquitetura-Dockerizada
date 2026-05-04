using CrudContatos.Domain.Entity;
using CrudContatos.Domain.Service.Interfaces;
using CrudContatos.Infra.Data;

namespace CrudContatos.Domain.Service;

// Serviço de autenticação.
// Login aceita todos os usuários da tabela [user].[usuario] — admin ou usuários regulares.
public class AuthService(AppDbContext context) : BaseService<Usuario>(context), IAuthService
{
    // Busca o usuário pelo e-mail e verifica a senha contra o hash BCrypt.
    // Retorna o registro de Usuario se as credenciais forem válidas; null caso contrário.
    public Usuario? ValidarCredenciais(string email, string senha)
    {
        var emailNormalizado = email.Trim();

        if (string.IsNullOrWhiteSpace(emailNormalizado) || string.IsNullOrWhiteSpace(senha))
            return null;

        using var db = new AppDbContext(ConnectionString);

        // Busca case-insensitive pelo e-mail na tabela de usuários
        var usuario = db.Usuarios
            .FirstOrDefault(u => u.Email != null &&
                                 u.Email.ToLower() == emailNormalizado.ToLower());

        if (usuario == null)   return null; // e-mail não encontrado
        if (string.IsNullOrWhiteSpace(usuario.Senha)) return null; // usuário sem senha configurada

        // BCrypt.Verify compara o texto plano com o hash armazenado em usuario.Senha
        try
        {
            if (!BCrypt.Net.BCrypt.Verify(senha, usuario.Senha)) return null;
        }
        catch (BCrypt.Net.SaltParseException)
        {
            return null;
        }

        return usuario;
    }
}
