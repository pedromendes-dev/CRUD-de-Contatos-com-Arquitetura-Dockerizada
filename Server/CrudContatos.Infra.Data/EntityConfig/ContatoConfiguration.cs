using CrudContatos.Domain.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CrudContatos.Infra.Data.EntityConfig;

public class ContatoConfiguration : IEntityTypeConfiguration<Contato>
{
    public void Configure(EntityTypeBuilder<Contato> builder)
    {
        builder.ToTable("Contato");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
               .HasColumnType("int")
               .IsRequired()
               .ValueGeneratedOnAdd();

        builder.Property(x => x.Nome)
               .HasColumnType("nvarchar")
               .HasMaxLength(200)
               .IsRequired();

        builder.Property(x => x.Telefone)
               .HasColumnType("nvarchar")
               .HasMaxLength(50)
               .IsRequired();

        builder.Property(x => x.Email)
               .HasColumnType("varchar")
               .HasMaxLength(255)
               .IsRequired(false);

        builder.Property(x => x.DataCriacao)
               .HasColumnType("datetime")
               .IsRequired(false);

        builder.Property(x => x.DataAtualizacao)
               .HasColumnType("datetime")
               .IsRequired(false);
    }
}
