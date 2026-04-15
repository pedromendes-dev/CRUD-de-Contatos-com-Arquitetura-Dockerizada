-- Criar database 
    CREATE DATABASE ContatosDB

-- Criar tabela contato
CREATE TABLE [ContatosDB].[dbo].[contato] (
    [Id] INT IDENTITY(1,1) PRIMARY KEY,
    [Nome] NVARCHAR(200) NOT NULL,
    [Telefone] NVARCHAR(50) NOT NULL,
    [DataCriacao] DATETIME2 DEFAULT GETUTCDATE(),
    [DataAtualizacao] DATETIME2 DEFAULT GETUTCDATE()
);

-- Inserir dados de exemplo na tabela contato
INSERT INTO [ContatosDB].[dbo].[contato] (Nome, Telefone) 
VALUES 
('João Silva', '(11) 99999-0000'),
('Maria Souza', '(21) 98888-2222'),
('Carlos Pereira', '(31) 97777-3333'),
('Ana Oliveira', '(41) 96666-4444'),
('Pedro Santos', '(51) 95555-5555'),
('Fernanda Lima', '(61) 94444-6666'),
('Ricardo Almeida', '(71) 93333-7777'),
('Patrícia Costa', '(81) 92222-8888'),
('Luís Fernandes', '(91) 91111-9999'),
('Beatriz Martins', '(85) 90000-1111'),
('Gabriel Rocha', '(62) 98877-2222'),
('Camila Ribeiro', '(63) 97766-3333'),
('André Carvalho', '(64) 96655-4444'),
('Juliana Melo', '(65) 95544-5555'),
('Marcelo Azevedo', '(66) 94433-6666');


select * from [ContatosDB].[dbo].[contato]