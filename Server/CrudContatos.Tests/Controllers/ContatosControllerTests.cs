using CrudContatos.Api.Controllers;
using CrudContatos.Domain.Entity;
using CrudContatos.Domain.Service.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace CrudContatos.Tests.Controllers;

public class ContatosControllerTests
{
    private readonly Mock<IContatoService> _serviceMock;
    private readonly ContatosController _controller;

    public ContatosControllerTests()
    {
        _serviceMock = new Mock<IContatoService>();
        _controller = new ContatosController(_serviceMock.Object);
    }

    // ─────────────────────────────────── BuscarTodos ───────────────────────────────────

    [Fact]
    public void BuscarTodos_RetornaOkComListaDeContatos()
    {
        var contatos = new List<Contato>
        {
            new() { Id = 1, Nome = "João", Email = "joao@email.com", Telefone = "11999990001" },
            new() { Id = 2, Nome = "Maria", Email = "maria@email.com", Telefone = "11999990002" },
        };
        _serviceMock.Setup(s => s.BuscarTodos()).Returns(contatos);

        var result = _controller.BuscarTodos();

        var ok = Assert.IsType<OkObjectResult>(result);
        var lista = Assert.IsAssignableFrom<IEnumerable<Contato>>(ok.Value);
        Assert.Equal(2, lista.Count());
    }

    [Fact]
    public void BuscarTodos_QuandoListaVazia_RetornaOkComListaVazia()
    {
        _serviceMock.Setup(s => s.BuscarTodos()).Returns([]);

        var result = _controller.BuscarTodos();

        var ok = Assert.IsType<OkObjectResult>(result);
        var lista = Assert.IsAssignableFrom<IEnumerable<Contato>>(ok.Value);
        Assert.Empty(lista);
    }

    // ─────────────────────────────────── ObterQuantidade ───────────────────────────────────

    [Fact]
    public void ObterQuantidade_RetornaOkComTotal()
    {
        _serviceMock.Setup(s => s.ObterQuantidade()).Returns(5);

        var result = _controller.ObterQuantidade();

        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(ok.Value);
    }

    // ─────────────────────────────────── BuscarPorId ───────────────────────────────────

    [Fact]
    public void BuscarPorId_QuandoContatoExiste_RetornaOkComContato()
    {
        var contato = new Contato { Id = 1, Nome = "João", Email = "joao@email.com", Telefone = "11999990001" };
        _serviceMock.Setup(s => s.BuscarPorId(1)).Returns(contato);

        var result = _controller.BuscarPorId(1);

        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(contato, ok.Value);
    }

    [Fact]
    public void BuscarPorId_QuandoContatoNaoExiste_RetornaNotFound()
    {
        _serviceMock.Setup(s => s.BuscarPorId(99)).Returns((Contato?)null);

        var result = _controller.BuscarPorId(99);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    // ─────────────────────────────────── CriarNovo ───────────────────────────────────

    [Fact]
    public void CriarNovo_RetornaCreatedAtAction()
    {
        var contato = new Contato { Nome = "Pedro", Email = "pedro@email.com", Telefone = "11999990003" };
        _serviceMock.Setup(s => s.Adicionar(contato));

        var result = _controller.CriarNovo(contato);

        Assert.IsType<CreatedAtActionResult>(result);
        _serviceMock.Verify(s => s.Adicionar(contato), Times.Once);
    }

    // ─────────────────────────────────── AtualizarId ───────────────────────────────────

    [Fact]
    public void AtualizarId_QuandoContatoExiste_RetornaNoContent()
    {
        var existente = new Contato { Id = 1, Nome = "João" };
        var contato = new Contato { Nome = "João Atualizado", Email = "joao@email.com", Telefone = "11999990001" };
        _serviceMock.Setup(s => s.BuscarPorId(1)).Returns(existente);

        var result = _controller.AtualizarId(1, contato);

        Assert.IsType<NoContentResult>(result);
        _serviceMock.Verify(s => s.AtualizarPorId(It.IsAny<Contato>()), Times.Once);
    }

    [Fact]
    public void AtualizarId_QuandoContatoNaoExiste_RetornaNotFound()
    {
        _serviceMock.Setup(s => s.BuscarPorId(99)).Returns((Contato?)null);

        var result = _controller.AtualizarId(99, new Contato());

        Assert.IsType<NotFoundObjectResult>(result);
        _serviceMock.Verify(s => s.AtualizarPorId(It.IsAny<Contato>()), Times.Never);
    }

    // ─────────────────────────────────── DeletarId ───────────────────────────────────

    [Fact]
    public void DeletarId_QuandoContatoExiste_RetornaNoContent()
    {
        var existente = new Contato { Id = 1, Nome = "João" };
        _serviceMock.Setup(s => s.BuscarPorId(1)).Returns(existente);

        var result = _controller.DeletarId(1);

        Assert.IsType<NoContentResult>(result);
        _serviceMock.Verify(s => s.DeletarPorId(1), Times.Once);
    }

    [Fact]
    public void DeletarId_QuandoContatoNaoExiste_RetornaNotFound()
    {
        _serviceMock.Setup(s => s.BuscarPorId(99)).Returns((Contato?)null);

        var result = _controller.DeletarId(99);

        Assert.IsType<NotFoundObjectResult>(result);
        _serviceMock.Verify(s => s.DeletarPorId(It.IsAny<int>()), Times.Never);
    }
}
