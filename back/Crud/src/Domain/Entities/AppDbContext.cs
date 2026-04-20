using Microsoft.EntityFrameworkCore;

namespace CrudContatos.src.Domain.Entities
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }  // Construtor que recebe as opções de configuração do DbContext e as passa para a classe base

        public DbSet<Contato> Contatos { get; set; }  // Propriedade do tipo DbSet<Contato> que representa a tabela de contatos no banco de dados
    }
}
