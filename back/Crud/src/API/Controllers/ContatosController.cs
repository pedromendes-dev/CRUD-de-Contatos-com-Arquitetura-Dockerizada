using Microsoft.AspNetCore.Mvc;
using Contatos.src.API.Services;
using Contatos.src.API.DTOs;

namespace Contatos.src.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ContatosController : ControllerBase
    {
        private readonly ContatoService _contatoService;  //Atributo setado via injeção de dependência

        public ContatosController(ContatoService contatoService)  //Constructor para injeção de dependência do ConatoService
        {
            _contatoService = contatoService;
        }


        [HttpGet("listarTodos")]   // Listar todos os contatos
        public IActionResult GetAll()
        {
            var contatos = _contatoService.GetAll();
            return Ok(contatos);
        }

        [HttpGet("quantidade")] // Retorna apenas a quantidade total de contatos
        public IActionResult GetCount()
        {
            var total = _contatoService.GetCount();
            return Ok(new { total });
        }

        [HttpGet("buscarPorId")]  // Buscar um contato por ID
        public IActionResult GetById(int id)
        {
            var contato = _contatoService.GetById(id);
            if (contato == null) return NotFound($"Contato com ID {id} não encontrado.");
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
            if (contato == null) return NotFound($"Não foi possível atualizar: contato com ID {id} não encontrado.");
            contato.Nome = dto.Nome;
            contato.Telefone = dto.Telefone;
            contato.DataAtualizacao = DateTime.UtcNow;
            _contatoService.Update(contato);
            return NoContent();
        }


        [HttpDelete("deletarId")]  // Deletar um contato por ID
        public IActionResult Delete(int id)
        {
           var contato = _contatoService.GetById(id);
              if (contato == null) return NotFound($"Não foi possível excluir: contato com ID {id} não encontrado.");
           _contatoService.Delete(id);
           return NoContent();
        }
    }
}


    
