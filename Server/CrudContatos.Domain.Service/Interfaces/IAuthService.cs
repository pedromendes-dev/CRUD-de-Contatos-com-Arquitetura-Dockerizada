using CrudContatos.Domain.Entity;

namespace CrudContatos.Domain.Service.Interfaces;

// Contrato do serviço de autenticação.
// Valida as credenciais na tabela usuario (todos os usuários, não apenas admins).
// A geração do JWT fica no AuthController.
public interface IAuthService
{
    // Retorna o Usuario autenticado se e-mail e senha forem válidos; null caso contrário.
    Usuario? ValidarCredenciais(string email, string senha);
}
