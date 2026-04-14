using System.ComponentModel.DataAnnotations.Schema;

namespace CrudContatos.src.Domain.Entities
{
    [Table("Contato")]
    public class Contato
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Telefone { get; set; } = string.Empty;
        public DateTime DataCriacao { get; set; }
        public DateTime DataAtualizacao { get; set; }

    }
}
