namespace CrudContatos.Core.DTOs
{
    // DTO recebido no endpoint POST /Auth/Login
    public class LoginDto
    {
        // E-mail do usuário (identificador único)
        public string Email { get; set; } = string.Empty;

        // Senha em texto plano — validada contra o hash BCrypt no AuthService
        public string Senha { get; set; } = string.Empty;
    }
}
