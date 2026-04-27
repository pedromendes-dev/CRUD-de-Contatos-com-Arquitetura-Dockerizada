using CrudContatos.Infra.Data;
using Microsoft.EntityFrameworkCore;

namespace CrudContatos.Domain.Service;

public class BaseService<T> where T : class
{
    protected string ConnectionString { get; }

    public BaseService(AppDbContext context)
    {
        ArgumentNullException.ThrowIfNull(context);
        ConnectionString = context.Database.GetConnectionString()
            ?? throw new InvalidOperationException("Connection string não configurada.");
    }
}
