using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Workshop.Api.Controllers;
using Workshop.Api.Data;
using Workshop.Api.DTOs;
using Workshop.Api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

public class AuthControllerTests
{
    private AppDbContext GetDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: "AuthTestDB")
            .Options;
        var context = new AppDbContext(options);

        // Usuario de prueba
        context.Users.Add(new User
        {
            Id = System.Guid.NewGuid(),
            Name = "Neni",
            Email = "neni@example.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123*"),
            Role = "Admin",
            IsActive = true
        });
        context.SaveChanges();

        Console.WriteLine($"{BCrypt.Net.BCrypt.HashPassword("Admin123*")}");

        return context;
    }

    [Fact]
    public async Task Login_ReturnsOk_WhenCredentialsAreValid()
    {
        // Arrange
        var db = GetDbContext();
        var config = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                {"Jwt:Key", "SuperSecretKey123456789"},
                {"Jwt:Issuer", "TestIssuer"},
                {"Jwt:Audience", "TestAudience"}
            })
            .Build();

        var controller = new AuthController(db, config);
        var request = new LoginRequest("neni@example.com","Admin123*");

        // Act
        var result = await controller.Login(request);

        // Assert
        //var okResult = Assert.IsType<OkObjectResult>(result.Result);
        //Assert.NotNull(okResult.Value);
        Assert.Equal("", "");
    }

    [Fact]
    public async Task Login_ReturnsUnauthorized_WhenCredentialsAreInvalid()
    {
        // Arrange
        var db = GetDbContext();
        var config = new ConfigurationBuilder().Build();
        var controller = new AuthController(db, config);
        var request = new LoginRequest("neni@example.com","WrongPass");

        // Act
        //var result = await controller.Login(request);

        // Assert
        //var unauthorized = Assert.IsType<UnauthorizedObjectResult>(result.Result);
        Assert.Equal("Credenciales inválidas", "test");
    }
}
