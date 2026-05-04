using CrudContatos.Api.Middlewares;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace CrudContatos.Tests.Middlewares;

public class ExceptionMiddlewareTests
{
    private static ExceptionMiddleware CriarMiddleware(RequestDelegate next) =>
        new(next, Mock.Of<ILogger<ExceptionMiddleware>>());

    private static DefaultHttpContext CriarContexto()
    {
        var context = new DefaultHttpContext();
        context.Response.Body = new MemoryStream(); // permite escrita do JSON de erro
        return context;
    }

    // ─────────────────────────────────── Fluxo normal ───────────────────────────────────

    [Fact]
    public async Task InvokeAsync_QuandoSemExcecao_PassaParaProximoMiddleware()
    {
        var proximoChamado = false;
        var middleware = CriarMiddleware(_ =>
        {
            proximoChamado = true;
            return Task.CompletedTask;
        });

        await middleware.InvokeAsync(CriarContexto());

        Assert.True(proximoChamado);
    }

    [Fact]
    public async Task InvokeAsync_QuandoSemExcecao_MantemStatus200()
    {
        var middleware = CriarMiddleware(_ => Task.CompletedTask);
        var context = CriarContexto();

        await middleware.InvokeAsync(context);

        Assert.Equal(200, context.Response.StatusCode);
    }

    // ─────────────────────────────────── Exceções mapeadas ───────────────────────────────────

    [Theory]
    [InlineData(typeof(ArgumentException), 400)]
    [InlineData(typeof(ArgumentNullException), 400)]
    [InlineData(typeof(KeyNotFoundException), 404)]
    [InlineData(typeof(InvalidOperationException), 422)]
    public async Task InvokeAsync_QuandoExcecaoMapeada_RetornaStatusCorreto(Type tipoExcecao, int statusEsperado)
    {
        var excecao = (Exception)Activator.CreateInstance(tipoExcecao, "mensagem de teste")!;
        var middleware = CriarMiddleware(_ => throw excecao);
        var context = CriarContexto();

        await middleware.InvokeAsync(context);

        Assert.Equal(statusEsperado, context.Response.StatusCode);
    }

    // ─────────────────────────────────── Exceção genérica ───────────────────────────────────

    [Fact]
    public async Task InvokeAsync_QuandoExcecaoNaoMapeada_Retorna500()
    {
        var middleware = CriarMiddleware(_ => throw new Exception("erro inesperado"));
        var context = CriarContexto();

        await middleware.InvokeAsync(context);

        Assert.Equal(500, context.Response.StatusCode);
    }

    [Fact]
    public async Task InvokeAsync_QuandoExcecaoNaoMapeada_RetornaJsonComContentType()
    {
        var middleware = CriarMiddleware(_ => throw new Exception("erro inesperado"));
        var context = CriarContexto();

        await middleware.InvokeAsync(context);

        Assert.Equal("application/json", context.Response.ContentType);
    }

    // ─────────────────────────────────── Logging ───────────────────────────────────

    [Fact]
    public async Task InvokeAsync_QuandoExcecao_LogaOErro()
    {
        var loggerMock = new Mock<ILogger<ExceptionMiddleware>>();
        var middleware = new ExceptionMiddleware(
            _ => throw new Exception("erro de log"),
            loggerMock.Object
        );
        var context = CriarContexto();

        await middleware.InvokeAsync(context);

        loggerMock.Verify(
            l => l.Log(
                LogLevel.Error,
                It.IsAny<EventId>(),
                It.IsAny<It.IsAnyType>(),
                It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
            Times.Once);
    }
}
