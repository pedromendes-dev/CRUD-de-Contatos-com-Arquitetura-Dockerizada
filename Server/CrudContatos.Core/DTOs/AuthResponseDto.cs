namespace CrudContatos.Core.DTOs
{
    // DTO retornado ao cliente após login bem-sucedido.
    // Contém o token JWT e os dados básicos do usuário para exibição na interface.
    public class AuthResponseDto
    {
        // Token JWT assinado — deve ser enviado no header Authorization: Bearer <token>
        public string Token { get; set; } = string.Empty;

        // Nome do usuário para exibição na sidebar
        public string Nome { get; set; } = string.Empty;

        // E-mail do usuário autenticado
        public string Email { get; set; } = string.Empty;

        // Data/hora UTC de expiração do token — o frontend usa para renovação ou logout automático
        public DateTime ExpiresAt { get; set; }
    }
}
