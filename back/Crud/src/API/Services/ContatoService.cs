using Contatos.src.API.DTOs;
using CrudContatos.src.Domain.Entities;

namespace Contatos.src.API.Services
{
    public class ContatoService
    {
        private readonly AppDbContext _context;

        public ContatoService(AppDbContext context)
        {
            _context = context;
        }

        public IEnumerable<ContatoDto> GetAll() // Pega todos os contatos do banco de dados e os transforma em DTOs para serem retornados
        {
            return _context.Contatos.Select(c => new ContatoDto
            {
                Id = c.Id,
                Nome = c.Nome,
                Telefone = c.Telefone,
                DataCriacao = c.DataCriacao,
                DataAtualizacao = c.DataAtualizacao
            }).ToList();
        }

        public ContatoDto? GetById(int id)  // Pega um contato específico do banco de dados pelo ID e o transforma em um DTO para ser retornado
        {
            var contato = _context.Contatos.FirstOrDefault(c => c.Id == id);
            if (contato == null) return null;
            return new ContatoDto
            {
                Id = contato.Id,
                Nome = contato.Nome,
                Telefone = contato.Telefone,
                DataCriacao = contato.DataCriacao,
                DataAtualizacao = contato.DataAtualizacao
            };
        }

        public void Add(ContatoDto dto)  // Cria um novo contato a partir dos dados do DTO e o adiciona ao banco de dados
        {
            var contato = new Contato
            {
                Nome = dto.Nome,
                Telefone = dto.Telefone,
                DataCriacao = DateTime.UtcNow,
                DataAtualizacao = DateTime.UtcNow
            };
            _context.Contatos.Add(contato);
            _context.SaveChanges();
            dto.Id = contato.Id;
            dto.DataCriacao = contato.DataCriacao;
            dto.DataAtualizacao = contato.DataAtualizacao;
        }

        public void Update(ContatoDto dto)  // Atualiza um contato existente no banco de dados com os dados do DTO, se o contato existir
        {
            var contato = _context.Contatos.FirstOrDefault(c => c.Id == dto.Id);
            if (contato == null) return;
            contato.Nome = dto.Nome;
            contato.Telefone = dto.Telefone;
            contato.DataAtualizacao = DateTime.UtcNow;
            _context.SaveChanges();
        }

        public void Delete(int id)  // Remove um contato do banco de dados pelo ID, se o contato existir   
        {
            var contato = _context.Contatos.FirstOrDefault(c => c.Id == id);
            if (contato == null) return;
            _context.Contatos.Remove(contato);
            _context.SaveChanges();
        }
    }
}