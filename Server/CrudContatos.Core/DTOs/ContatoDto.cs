namespace CrudContatos.Core.DTOs
{
    public class ContatoDTO
    {
        public int Id { get; set; }
        public string? Nome { get; set; } = string.Empty;
        public string? Telefone { get; set; } = string.Empty;
        public string? Email { get; set; } = string.Empty;
        public DateTime? DataCriacao { get; set; }
        public DateTime? DataAtualizacao { get; set; }
    }
}


