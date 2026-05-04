-- Inicialização do banco de dados ContatosDB
IF DB_ID('ContatosDB') IS NULL
BEGIN
    CREATE DATABASE ContatosDB;
END
GO

USE ContatosDB;
GO

-- Criar schema `user` caso não exista
IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = 'user')
BEGIN
    EXEC('CREATE SCHEMA [user]');
END
GO

-- Criar schema `finance` caso não exista
IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = 'finance')
BEGIN
    EXEC('CREATE SCHEMA [finance]');
END
GO

-- Criar schema `admin` caso não exista
IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = 'admin')
BEGIN
    EXEC('CREATE SCHEMA [admin]');
END
GO

-- Tabela `usuario` (schema user)
IF OBJECT_ID('user.usuario', 'U') IS NULL
BEGIN
    CREATE TABLE [user].[usuario] (
        [Id] INT IDENTITY(1,1) PRIMARY KEY,
        [Nome] NVARCHAR(255) NOT NULL,
        [Telefone] NVARCHAR(50) NOT NULL,
        [Email] VARCHAR(255) NULL,
        [Senha] NVARCHAR(100) NULL,
        [DataCriacao] DATETIME2 NULL DEFAULT SYSUTCDATETIME(),
        [DataAtualizacao] DATETIME2 NULL
    );
END
GO

-- Tabela `administrador` (PK = UsuarioId, mapeada em AdministradorConfiguration)
IF OBJECT_ID('admin.administrador', 'U') IS NULL
BEGIN
    CREATE TABLE [admin].[administrador] (
        [UsuarioId] INT NOT NULL PRIMARY KEY,
        [Nome] NVARCHAR(200) NULL,
        [Email] VARCHAR(255) NULL,
        [Senha] NVARCHAR(100) NULL
    );
    -- FK para usuario.Id
    ALTER TABLE [admin].[administrador]
        ADD CONSTRAINT FK_Administrador_Usuario FOREIGN KEY (UsuarioId) REFERENCES [user].[usuario](Id);
END
GO

-- Tabela `contato` (schema finance)
IF OBJECT_ID('finance.contato', 'U') IS NULL
BEGIN
    CREATE TABLE [finance].[contato] (
        [Id] INT IDENTITY(1,1) PRIMARY KEY,
        [Nome] NVARCHAR(200) NOT NULL,
        [Telefone] NVARCHAR(50) NOT NULL,
        [Email] VARCHAR(255) NULL,
        [DataCriacao] DATETIME2 DEFAULT SYSUTCDATETIME(),
        [DataAtualizacao] DATETIME2 DEFAULT SYSUTCDATETIME()
    );
END
GO

-- Dados de exemplo para `usuario` (todos os usuários podem fazer login)
-- Senhas hashadas em BCrypt. Hash abaixo é BCrypt de "senha123".
-- Para gerar novos hashes, use: BCrypt.Net.BCrypt.HashPassword("sua_senha")
-- Credenciais de teste: admin@smartreg.com / senha123 | pedro@exemplo.com / senha123
IF NOT EXISTS (SELECT 1 FROM [user].[usuario])
BEGIN
    INSERT INTO [user].[usuario] (Nome, Telefone, Email, Senha, DataCriacao)
    VALUES
      ('Administrador', '(11) 9999-9999', 'admin@smartreg.com', '$2a$11$DpLvIXXJJdgCfvvgF1.r7uZCKQU8X/IEfLpRGvFRx9X6R6F.bJrXi', SYSUTCDATETIME()),
      ('Pedro Mendes', '(11) 9888-8888', 'pedro@exemplo.com', '$2a$11$DpLvIXXJJdgCfvvgF1.r7uZCKQU8X/IEfLpRGvFRx9X6R6F.bJrXi', SYSUTCDATETIME());
END
GO

-- Inserir registro de administrador ligado ao usuário admin criado acima.
-- Agora todos os usuários fazem login via [user].[usuario]; administrador é apenas uma relação opcional.
IF NOT EXISTS (SELECT 1 FROM [admin].[administrador])
BEGIN
    -- Recupera o Id do primeiro usuário (Administrador) para ser o UsuarioId
    DECLARE @adminUserId INT = (SELECT TOP (1) Id FROM [user].[usuario] WHERE Email = 'admin@smartreg.com');
    IF @adminUserId IS NOT NULL
    BEGIN
        INSERT INTO [admin].[administrador] (UsuarioId, Nome, Email, Senha)
        VALUES (@adminUserId, 'Administrador', 'admin@smartreg.com', '$2a$11$DpLvIXXJJdgCfvvgF1.r7uZCKQU8X/IEfLpRGvFRx9X6R6F.bJrXi');
    END
END
GO
