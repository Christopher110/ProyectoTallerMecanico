using Xunit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Workshop.Api.Controllers;
using Workshop.Api.Data;
using Workshop.Api.DTOs;
using Workshop.Api.Models;
using System.Threading.Tasks;

public class CustomersControllerTests
{
    private AppDbContext GetDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: "CustomerTestDB")
            .Options;
        return new AppDbContext(options);
    }

    [Fact]
    public async Task Create_ReturnsCreatedAtAction_WhenCustomerIsValid()
    {
        // Arrange
        var db = GetDbContext();
        var controller = new CustomersController(db);

        var dto = new CustomerCreateDto
        {
            FullName = "Chica Glow",
            Phone = "555-1234",
            Email = "chica@example.com",
            Address = "Ciudad Dreamcore"
        };

        // Act
        var result = await controller.Create(dto);

        // Assert
        var created = Assert.IsType<CreatedAtActionResult>(result);
        var customer = Assert.IsType<Customer>(created.Value);
        Assert.Equal("Chica Glow", customer.FullName);
        Assert.Equal(1, await db.Customers.CountAsync());
    }
}
