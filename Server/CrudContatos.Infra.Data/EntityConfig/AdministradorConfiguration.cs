using CrudContatos.Domain.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CrudContatos.Infra.Data.EntityConfig;

public class AdministradorConfiguration : IEntityTypeConfiguration<Administrador>
{
    public void Configure(EntityTypeBuilder<Administrador> builder)
    {
              builder.ToTable("administrador", "admin"); // Especifica o nome da tabela e o esquema

        builder.HasKey(x => x.UsuarioId); // UsuarioId é PK e FK para [user].[usuario]

        builder.Property(x => x.UsuarioId)
               .HasColumnType("int")
               .IsRequired()
               .ValueGeneratedNever(); // Valor vem de usuario.Id — não é auto-increment

        builder.Property(x => x.Nome)
               .HasColumnType("nvarchar")
               .HasMaxLength(200)
               .IsRequired(false);

        builder.Property(x => x.Email)
               .HasColumnType("varchar")
               .HasMaxLength(255)
               .IsRequired(false);

        builder.Property(x => x.Senha)
               .HasColumnType("nvarchar")
               .HasMaxLength(100)
               .IsRequired(false);
    }
}
