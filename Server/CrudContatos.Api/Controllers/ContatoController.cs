using CrudContatos.Core.DTOs;
using CrudContatos.Domain.Service;
using Microsoft.AspNetCore.Mvc;

namespace CrudContatos.Api.Controllers;

[ApiController]
[Route("[controller]")]  // nginx remove o nome do controller da rota, então as rotas ficam mais limpas
public class ContatosController(ContatoService contatoService) : ControllerBase
{
    [HttpGet("BuscarTodos")]
    public IActionResult BuscarTodos()
    {
        var contatos = contatoService.BuscarTodos();
        return Ok(contatos);
    }

    [HttpGet("ObterQuantidade")]
    public IActionResult ObterQuantidade()
    {
        var total = contatoService.ObterQuantidade();
        return Ok(new { total });
    }

    [HttpGet("BuscarPorId")]
    public IActionResult BuscarPorId(int id)
    {
        var contato = contatoService.BuscarPorId(id);
        if (contato == null) return NotFound($"Contato com ID {id} não encontrado.");
        return Ok(contato);
    }

    [HttpPost("CriarNovo")]
    public IActionResult CriarNovo(ContatoDTO dto)
    {
        contatoService.Adicionar(dto);
        return CreatedAtAction(nameof(BuscarPorId), new { id = dto.Id }, dto);
    }

    [HttpPut("AtualizarId")]
    public IActionResult AtualizarId(int id, ContatoDTO dto)
    {
        var existente = contatoService.BuscarPorId(id);
        if (existente == null) return NotFound($"Não foi possível atualizar: contato com ID {id} não encontrado.");
        dto.Id = id;
        contatoService.AtualizarPorId(dto);
        return NoContent();
    }

    [HttpDelete("DeletarId")]
    public IActionResult DeletarId(int id)
    {
        var existente = contatoService.BuscarPorId(id);
        if (existente == null) return NotFound($"Não foi possível excluir: contato com ID {id} não encontrado.");
        contatoService.DeletarPorId(id);
        return NoContent();
    }
}
