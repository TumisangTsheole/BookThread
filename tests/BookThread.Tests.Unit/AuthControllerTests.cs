using BookThread.Data.Entities;
using BookThread.Data.DbService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Xunit;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

namespace BookThread.Tests.Unit
{
    public class AuthControllerTests
    {
        private readonly AppDbContext _dbContext;
        private readonly AuthController _controller;

        public AuthControllerTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "AuthTestDb")
                .Options;

            _dbContext = new AppDbContext(options);
            _dbContext.Database.EnsureDeleted();

            var inMemorySettings = new Dictionary<string, string>
            {
                { "Jwt:Key", "this_is_a_super_long_secret_key_for_jwt_signing_1234567890" },
                { "Jwt:Issuer", "BookThreadAPI" },
                { "Jwt:Audience", "BookThreadClient" }
            };

            var config = new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings)
                .Build();

            _controller = new AuthController(config, _dbContext);
        }

        [Fact]
        public async Task Register_ShouldCreateUser_WhenValidRequest()
        {
            // Arrange
            var request = new AuthController.RegisterRequest(
                Username: "newuser",
                Email: "new@example.com",
                Password: "password123",
                Bio: "Hello world"
            );

            // Act
            var result = await _controller.Register(request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var json = System.Text.Json.JsonSerializer.Serialize(okResult.Value);
            var doc = System.Text.Json.JsonDocument.Parse(json);

            Assert.Equal("User registered successfully.", doc.RootElement.GetProperty("message").GetString());

            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Username == "newuser");
            Assert.NotNull(user);
            Assert.Equal("new@example.com", user.Email);
        }

        [Fact]
        public async Task Register_ShouldReturnBadRequest_WhenUserExists()
        {
            // Arrange
            _dbContext.Users.Add(new User
            {
                Id = Guid.NewGuid(),
                Username = "duplicate",
                Email = "dup@example.com",
                PasswordHash = "hashed"
            });
            await _dbContext.SaveChangesAsync();

            var request = new AuthController.RegisterRequest(
                Username: "duplicate",
                Email: "dup@example.com",
                Password: "password123",
                Bio: null
            );

            // Act
            var result = await _controller.Register(request);

            // Assert
            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            var json = System.Text.Json.JsonSerializer.Serialize(badRequest.Value);
            var doc = System.Text.Json.JsonDocument.Parse(json);

            Assert.Equal("Username or email already exists.", doc.RootElement.GetProperty("error").GetString());
        }

        [Fact]
        public async Task Login_ShouldReturnToken_WhenValidCredentials()
        {
            // Arrange
            var password = "password123";
            var hashed = BCrypt.Net.BCrypt.HashPassword(password);

            var user = new User
            {
                Id = Guid.NewGuid(),
                Username = "loginuser",
                Email = "login@example.com",
                PasswordHash = hashed
            };
            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();

            var request = new AuthController.LoginRequest(
                UsernameOrEmail: "loginuser",
                Password: password
            );

            // Act
            var result = await _controller.Login(request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var json = System.Text.Json.JsonSerializer.Serialize(okResult.Value);
            var doc = System.Text.Json.JsonDocument.Parse(json);

            var token = doc.RootElement.GetProperty("token").GetString();
            Assert.False(string.IsNullOrEmpty(token));
        }

        [Fact]
        public async Task Login_ShouldReturnUnauthorized_WhenInvalidCredentials()
        {
            // Arrange
            var user = new User
            {
                Id = Guid.NewGuid(),
                Username = "wronguser",
                Email = "wrong@example.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("correctpassword")
            };
            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();

            var request = new AuthController.LoginRequest(
                UsernameOrEmail: "wronguser",
                Password: "badpassword"
            );

            // Act
            var result = await _controller.Login(request);

            // Assert
            var unauthorized = Assert.IsType<UnauthorizedObjectResult>(result);
            var json = System.Text.Json.JsonSerializer.Serialize(unauthorized.Value);
            var doc = System.Text.Json.JsonDocument.Parse(json);

            Assert.Equal("Invalid credentials.", doc.RootElement.GetProperty("error").GetString());
        }
    }
}
