using CrudContatos.Infra.Data;
using Microsoft.EntityFrameworkCore;

namespace CrudContatos.Domain.Service;

public class BaseService<T> where T : class
{
    protected string ConnectionString { get; }

    public BaseService(AppDbContext context)   // BaseService agora recebe o AppDbContext para extrair a string de conexão
    {
        ArgumentNullException.ThrowIfNull(context);   // Verifica se o contexto é nulo e lança uma exceção se for
        ConnectionString = context.Database.GetConnectionString()    // Obtém a string de conexão do DbContext usando o método GetConnectionString() do Database
            ?? throw new InvalidOperationException("Connection string não configurada.");   // Lança uma exceção se a string de conexão for nula
    } 
}
