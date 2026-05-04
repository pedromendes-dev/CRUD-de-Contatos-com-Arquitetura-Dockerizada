using CrudContatos.Domain.Entity;
using CrudContatos.Domain.Service.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CrudContatos.Api.Controllers;

[ApiController]
[Route("[controller]")]  // nginx remove o nome do controller da rota, então as rotas ficam mais limpas
[Authorize] // Todos os endpoints de contatos exigem JWT válido no header Authorization: Bearer <token>
public class ContatosController(IContatoService contatoService) : ControllerBase
{
    [Authorize]
    [HttpGet("BuscarTodos")]
    public IActionResult BuscarTodos()
    {
        var contatos = contatoService.BuscarTodos();
        return Ok(contatos);
    }

    [Authorize]
    [HttpGet("ObterQuantidade")]
    public IActionResult ObterQuantidade()
    {
        var total = contatoService.ObterQuantidade();
        return Ok(new { total });
    }

    [Authorize]
    [HttpGet("BuscarPorId")]
    public IActionResult BuscarPorId(int id)
    {
        var contato = contatoService.BuscarPorId(id);
        if (contato == null) return NotFound($"Contato com ID {id} não encontrado.");
        return Ok(contato);
    }

    [Authorize]
    [HttpPost("CriarNovo")]
    public IActionResult CriarNovo(Contato contato)
    {
        contatoService.Adicionar(contato);
        return CreatedAtAction(nameof(BuscarPorId), new { id = contato.Id }, contato);
    }

    [Authorize]
    [HttpPut("AtualizarId")]
    public IActionResult AtualizarId(int id, Contato contato)
    {
        var existente = contatoService.BuscarPorId(id);
        if (existente == null) return NotFound($"Não foi possível atualizar: contato com ID {id} não encontrado.");
        contato.Id = id;
        contatoService.AtualizarPorId(contato);
        return NoContent();
    }

    [Authorize]
    [HttpDelete("DeletarId")]
    public IActionResult DeletarId(int id)
    {
        var existente = contatoService.BuscarPorId(id);
        if (existente == null) return NotFound($"Não foi possível excluir: contato com ID {id} não encontrado.");
        contatoService.DeletarPorId(id);
        return NoContent();
    }
}
