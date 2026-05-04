using CrudContatos.Domain.Entity;
using CrudContatos.Domain.Service.Interfaces;
using CrudContatos.Infra.Data;

namespace CrudContatos.Domain.Service;

public class ContatoService(AppDbContext context) : BaseService<Contato>(context), IContatoService
{
    public IEnumerable<Contato> BuscarTodos()
    {
        using var db = new AppDbContext(ConnectionString);
        return db.Contatos.ToList();
    }

    public int ObterQuantidade()
    {
        using var db = new AppDbContext(ConnectionString);
        return db.Contatos.Count();
    }

    public Contato? BuscarPorId(int id)
    {
        using var db = new AppDbContext(ConnectionString);
        return db.Contatos.FirstOrDefault(c => c.Id == id);
    }

    public void Adicionar(Contato contato)
    {
        using var db = new AppDbContext(ConnectionString);
        contato.DataCriacao = DateTime.UtcNow;
        contato.DataAtualizacao = DateTime.UtcNow;
        db.Contatos.Add(contato);
        db.SaveChanges();
    }

    public void AtualizarPorId(Contato contato)
    {
        using var db = new AppDbContext(ConnectionString);
        var existente = db.Contatos.FirstOrDefault(c => c.Id == contato.Id);
        if (existente == null) return;
        existente.Nome = contato.Nome;
        existente.Telefone = contato.Telefone;
        existente.Email = contato.Email;
        existente.DataAtualizacao = DateTime.UtcNow;
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
