using Microsoft.AspNetCore.Authorization;
using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace CrudContatos.Api.Swagger;

// Adiciona o cadeado e o requisito Bearer apenas nos endpoints marcados com [Authorize].
// Endpoints públicos (ex: POST /Auth/Login) continuam sem cadeado no Swagger.
public class AuthorizeOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        var hasAuthorize =
            context.MethodInfo.DeclaringType?
                .GetCustomAttributes(true).OfType<AuthorizeAttribute>().Any() == true
            || context.MethodInfo
                .GetCustomAttributes(true).OfType<AuthorizeAttribute>().Any()
            || context.ApiDescription.ActionDescriptor.EndpointMetadata
                .OfType<AuthorizeAttribute>().Any();

        if (!hasAuthorize)
        {
            // Endpoint público — remove o requisito global Bearer para que apareça sem cadeado
            operation.Security = [];
            return;
        }

        operation.Responses ??= new OpenApiResponses();
        operation.Responses.TryAdd("401", new OpenApiResponse { Description = "Não autorizado — token ausente ou inválido." });
    }
}
