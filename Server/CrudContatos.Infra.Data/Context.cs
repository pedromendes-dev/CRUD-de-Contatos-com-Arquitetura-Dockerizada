using CrudContatos.Domain.Entity;
using CrudContatos.Infra.Data.EntityConfig;
using Microsoft.EntityFrameworkCore;

namespace CrudContatos.Infra.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public AppDbContext(string connectionString) : this(GetOptions(connectionString)) { }  // Construtor vazio que aceita a string de conexão diretamente

    private static DbContextOptions<AppDbContext> GetOptions(string connectionString) // Método para criar as opções do DbContext a partir da string de conexão
    {
        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
        optionsBuilder.UseSqlServer(connectionString);
        return optionsBuilder.Options;
    }

    // DbSet para a entidade Contato
    public DbSet<Contato> Contatos { get; set; } = null!;

    // DbSet para a entidade Usuario
    public DbSet<Usuario> Usuarios { get; set; } = null!;

    // DbSet para a entidade Administrador
    public DbSet<Administrador> Administradores { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfiguration(new ContatoConfiguration());
        modelBuilder.ApplyConfiguration(new UsuarioConfiguration());
        modelBuilder.ApplyConfiguration(new AdministradorConfiguration());
    }
}
