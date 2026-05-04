using CrudContatos.Domain.Entity;

namespace CrudContatos.Domain.Service.Interfaces;

public interface IContatoService
{
    IEnumerable<Contato> BuscarTodos();
    int ObterQuantidade();
    Contato? BuscarPorId(int id);
    void Adicionar(Contato contato);
    void AtualizarPorId(Contato contato);
    void DeletarPorId(int id);
}
