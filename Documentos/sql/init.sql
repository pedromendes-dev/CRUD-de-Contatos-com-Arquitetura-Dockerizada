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

    ('João Silva', '(11) 99999-0000', 'joao@email.com'),
    ('Maria Souza', '(21) 98888-2222', 'maria@email.com'),
    ('Carlos Pereira', '(31) 97777-3333', 'carlos@email.com'),
    ('Ana Oliveira', '(41) 96666-4444', 'ana@email.com'),
    ('Pedro Santos', '(51) 95555-5555', 'pedro@email.com'),
    ('Fernanda Lima', '(61) 94444-6666', 'fernanda@email.com'),
    ('Ricardo Almeida', '(71) 93333-7777', 'ricardo@email.com'),
    ('Patrícia Costa', '(81) 92222-8888', 'patricia@email.com'),
    ('Luís Fernandes', '(91) 91111-9999', 'luis@email.com'),
    ('Beatriz Martins', '(85) 90000-1111', 'beatriz@email.com'),
    ('Gabriel Rocha', '(62) 98877-2222', 'gabriel@email.com'),
    ('Camila Ribeiro', '(63) 97766-3333', 'camila@email.com'),
    ('André Carvalho', '(64) 96655-4444', 'andre@email.com'),
    ('Juliana Melo', '(65) 95544-5555', 'juliana@email.com');


-- consultar os dados inseridos
select * from [ContatosDB].[dbo].[contato]


-- conferência de dados
USE ContatosDB;
SELECT COUNT(*) AS Total FROM Contato;
SELECT TOP 50 Id, Nome, Telefone, DataCriacao, DataAtualizacao
FROM Contato
ORDER BY Id DESC;