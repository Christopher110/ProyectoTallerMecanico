
# Workshop.Api (.NET 8 Web API)

## Setup
1) Crear la BD en SQL Server (o ajustar `appsettings.json`):
   - `Server=localhost;Database=WorkshopDb;User Id=sa;Password=Your_password123;TrustServerCertificate=True;`
2) Inicializar EF Core:
   ```bash
   dotnet tool install --global dotnet-ef
   dotnet ef migrations add Initial --project Workshop.Api.csproj
   dotnet ef database update --project Workshop.Api.csproj
   ```
3) Seed manual: insert un usuario admin:
   ```sql
   INSERT INTO Users (Id,Name,Email,PasswordHash,Role,IsActive,CreatedAt)
   VALUES (NEWID(),'Admin','admin@example.com','$2a$11$4PH8l8O1gStkYkqGZc1Jle1gJNPQmV3kH7W4T1g9Qm2uXb2oXgV9q','Admin',1,GETUTCDATE());
   -- Hash corresponde a 'Admin123*'
   ```
4) Correr API:
   ```bash
   dotnet run
   ```

## Swagger
- Disponible en `/swagger` (dev)
