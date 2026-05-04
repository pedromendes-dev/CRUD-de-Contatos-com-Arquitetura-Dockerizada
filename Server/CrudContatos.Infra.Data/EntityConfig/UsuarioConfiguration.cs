using CrudContatos.Domain.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CrudContatos.Infra.Data.EntityConfig;

public class UsuarioConfiguration : IEntityTypeConfiguration<Usuario>
{
    public void Configure(EntityTypeBuilder<Usuario> builder)
    {
        builder.ToTable("usuario", "user"); // Especifica o nome da tabela e o esquema

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
               .HasColumnType("int")
               .IsRequired()
               .ValueGeneratedOnAdd();

        builder.Property(x => x.Nome)
               .HasColumnType("nvarchar")
               .HasMaxLength(255)
               .IsRequired();

        builder.Property(x => x.Telefone)
               .HasColumnType("nvarchar")
               .HasMaxLength(50)
               .IsRequired();

        builder.Property(x => x.Email)
               .HasColumnType("varchar")
               .HasMaxLength(255)
               .IsRequired(false);

        builder.Property(x => x.Senha)
               .HasColumnType("nvarchar")
               .HasMaxLength(100)
               .IsRequired(false);

        builder.Property(x => x.DataCriacao)
               .HasColumnType("datetime2")
               .IsRequired(false);

        builder.Property(x => x.DataAtualizacao)
               .HasColumnType("datetime2")
               .IsRequired(false);
    }
}
