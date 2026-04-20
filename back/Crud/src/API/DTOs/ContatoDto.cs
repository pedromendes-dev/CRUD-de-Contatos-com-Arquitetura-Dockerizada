namespace Contatos.src.API.DTOs
{
    public class ContatoDto
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Telefone { get; set; } = string.Empty;
        public DateTime DataCriacao { get; set; }
        public DateTime DataAtualizacao { get; set; }
    }
}

// Usamos o Empty para inicializar as strings vazias para evitar que sejam nulas, garantindo que sempre tenham um valor, mesmo que seja uma string vazia.