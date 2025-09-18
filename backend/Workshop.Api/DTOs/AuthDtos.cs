namespace Workshop.Api.DTOs
{
    public record LoginRequest(string Email, string Password);
    public record LoginResponse(string Token, string Name, string Role, string Email);
}