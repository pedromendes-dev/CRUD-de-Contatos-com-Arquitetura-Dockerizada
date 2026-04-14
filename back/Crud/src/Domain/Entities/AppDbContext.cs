using Microsoft.EntityFrameworkCore;

namespace CrudContatos.src.Domain.Entities
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Contato> Contatos { get; set; }
    }
}
