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
('Pedro Santos', '(51) 95555-5555');
