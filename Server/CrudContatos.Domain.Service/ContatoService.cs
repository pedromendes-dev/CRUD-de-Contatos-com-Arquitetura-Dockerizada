using CrudContatos.Core.DTOs;
using CrudContatos.Domain.Entity;
using CrudContatos.Infra.Data;

namespace CrudContatos.Domain.Service;

public class ContatoService(AppDbContext context) : BaseService<Contato>(context)
{
    public IEnumerable<ContatoDTO> BuscarTodos()
    {
        using var db = new AppDbContext(ConnectionString);
        return db.Contatos.Select(c => new ContatoDTO
        {
            Id = c.Id,
            Nome = c.Nome,
            Telefone = c.Telefone,
            Email = c.Email,
            DataCriacao = c.DataCriacao,
            DataAtualizacao = c.DataAtualizacao
        }).ToList();
    }

    public int ObterQuantidade()
    {
        using var db = new AppDbContext(ConnectionString);
        return db.Contatos.Count();
    }

    public ContatoDTO? BuscarPorId(int id)
    {
        using var db = new AppDbContext(ConnectionString);
        var contato = db.Contatos.FirstOrDefault(c => c.Id == id);
        if (contato == null) return null;
        return new ContatoDTO
        {
            Id = contato.Id,
            Nome = contato.Nome,
            Telefone = contato.Telefone,
            Email = contato.Email,
            DataCriacao = contato.DataCriacao,
            DataAtualizacao = contato.DataAtualizacao
        };
    }

    public void Adicionar(ContatoDTO dto)
    {
        using var db = new AppDbContext(ConnectionString);
        var contato = new Contato
        {
            Nome = dto.Nome,
            Telefone = dto.Telefone,
            Email = dto.Email,
            DataCriacao = DateTime.UtcNow,
            DataAtualizacao = DateTime.UtcNow
        };
        db.Contatos.Add(contato);
        db.SaveChanges();
        dto.Id = contato.Id;
        dto.DataCriacao = contato.DataCriacao;
        dto.DataAtualizacao = contato.DataAtualizacao;
    }

    public void AtualizarPorId(ContatoDTO dto)
    {
        using var db = new AppDbContext(ConnectionString);
        var contato = db.Contatos.FirstOrDefault(c => c.Id == dto.Id);
        if (contato == null) return;
        contato.Nome = dto.Nome;
        contato.Telefone = dto.Telefone;
        contato.Email = dto.Email;
        contato.DataAtualizacao = DateTime.UtcNow;
        db.SaveChanges();
    }

    public void DeletarPorId(int id)
    {
        using var db = new AppDbContext(ConnectionString);
        var contato = db.Contatos.FirstOrDefault(c => c.Id == id);
        if (contato == null) return;
        db.Contatos.Remove(contato);
        db.SaveChanges();
    }
}
