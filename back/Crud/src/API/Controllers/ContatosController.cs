using Microsoft.AspNetCore.Mvc;
using Contatos.src.API.Services;
using Contatos.src.API.DTOs;

namespace Contatos.src.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ContatosController : ControllerBase
    {
        private readonly ContatoService _contatoService;

        public ContatosController(ContatoService contatoService)
        {
            _contatoService = contatoService;
        }


        [HttpGet("listartodos")]   // Listar todos os contatos
        public IActionResult GetAll()
        {
            var contatos = _contatoService.GetAll();
            return Ok(contatos);
        }

        [HttpGet("buscarPorId")]  // Buscar um contato por ID
        public IActionResult GetById(int id)
        {
            var contato = _contatoService.GetById(id);
            if (contato == null) return NotFound();
            return Ok(contato);
        }

        [HttpPost("criarNovo")]  // Criar um novo contato
        public IActionResult Create(ContatoDto dto)
        {
            _contatoService.Add(dto);
            return CreatedAtAction(nameof(GetById), new { id = dto.Id }, dto);
        }


        [HttpPut("atualizarId")]  // Atualizar um contato existente
        public IActionResult Update(int id, ContatoDto dto)
        {
            var contato = _contatoService.GetById(id);
            if (contato == null) return NotFound();
            contato.Nome = dto.Nome;
            contato.Telefone = dto.Telefone;
            contato.DataAtualizacao = DateTime.UtcNow;
            _contatoService.Update(contato);
            return NoContent();
        }


        [HttpDelete("deletarId")]
        public IActionResult Delete(int id)
        {
           var contato = _contatoService.GetById(id);
           if (contato == null) return NotFound();
           _contatoService.Delete(id);
           return NoContent();
        }
    }
}


