namespace CrudContatos.Api.Middlewares;

public class ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Erro não tratado em {Method} {Path}: {Message}",
                context.Request.Method, context.Request.Path, ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        var (statusCode, message, details) = exception switch
        {
            ArgumentNullException or ArgumentException =>
                (StatusCodes.Status400BadRequest, "Dados inválidos.", exception.Message),

            KeyNotFoundException =>
                (StatusCodes.Status404NotFound, "Recurso não encontrado.", exception.Message),

            InvalidOperationException =>
                (StatusCodes.Status422UnprocessableEntity, "Operação inválida.", exception.Message),

            _ =>
                (StatusCodes.Status500InternalServerError, "Ocorreu um erro interno no servidor.", "Contate o suporte técnico.")
        };

        context.Response.StatusCode = statusCode;

        var response = new ErrorResponse
        {
            StatusCode = statusCode,
            Message = message,
            Details = details,
            Timestamp = DateTime.UtcNow
        };

        await context.Response.WriteAsJsonAsync(response);
    }
}
