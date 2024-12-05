using INDUENDUM_API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProductsController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public ProductsController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    // GET: /api/products
    [HttpGet]
    public async Task<IActionResult> GetAllProducts()
    {
        try
        {
            var products = new List<Product>();

            using (var conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await conn.OpenAsync();
                using (var cmd = new SqlCommand("SELECT * FROM Products", conn))
                {
                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            products.Add(new Product
                            {
                                Id = reader.GetInt32(reader.GetOrdinal("Id")),
                                Name = reader.GetString(reader.GetOrdinal("Name")),
                                Description = reader.GetString(reader.GetOrdinal("Description")),
                                Price = reader.GetDecimal(reader.GetOrdinal("Price")),
                                ImageUrl = reader.IsDBNull(reader.GetOrdinal("ImageUrl")) ? string.Empty : reader.GetString(reader.GetOrdinal("ImageUrl")),
                                IsOnSale = reader.GetBoolean(reader.GetOrdinal("IsOnSale")),
                                CompanyId = reader.GetString(reader.GetOrdinal("CompanyId")),
                                CreatedAt = reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
                                UpdatedAt = reader.IsDBNull(reader.GetOrdinal("UpdatedAt")) ? null : reader.GetDateTime(reader.GetOrdinal("UpdatedAt"))
                            });
                        }
                    }
                }
            }

            return Ok(products);
        }
        catch (SqlException sqlEx)
        {
            return StatusCode(500, $"Gabim në bazën e të dhënave: {sqlEx.Message}");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Gabim i brendshëm gjatë marrjes së produkteve: {ex.Message}");
        }
    }

    // POST: /api/products
    [HttpPost]
    [Authorize(Roles = "Admin,Company")]
    public async Task<IActionResult> CreateProduct([FromBody] Product product)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            using (var conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await conn.OpenAsync();
                using (var cmd = new SqlCommand("AddProduct", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Name", product.Name);
                    cmd.Parameters.AddWithValue("@Description", product.Description);
                    cmd.Parameters.AddWithValue("@Price", product.Price);
                    cmd.Parameters.AddWithValue("@ImageUrl", product.ImageUrl);
                    cmd.Parameters.AddWithValue("@CompanyId", product.CompanyId);
                    cmd.Parameters.AddWithValue("@IsOnSale", product.IsOnSale);

                    await cmd.ExecuteNonQueryAsync();
                }
            }

            return CreatedAtAction(nameof(GetAllProducts), new { id = product.Id }, "Produkti u shtua me sukses.");
        }
        catch (SqlException sqlEx)
        {
            return StatusCode(500, $"Gabim në bazën e të dhënave: {sqlEx.Message}");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Gabim i brendshëm gjatë krijimit të produktit: {ex.Message}");
        }
    }
    // PUT: /api/products/{id}
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Company")]
    public async Task<IActionResult> UpdateProduct(int id, [FromBody] Product product)
    {
        if (id != product.Id)
        {
            return BadRequest(new { message = "ID e dhënë nuk përputhet me objektin." });
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            using (var conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await conn.OpenAsync();
                using (var cmd = new SqlCommand("UPDATE Products SET Name = @Name, Description = @Description, Price = @Price, ImageUrl = @ImageUrl, IsOnSale = @IsOnSale WHERE Id = @Id", conn))
                {
                    cmd.Parameters.AddWithValue("@Id", id);
                    cmd.Parameters.AddWithValue("@Name", product.Name);
                    cmd.Parameters.AddWithValue("@Description", product.Description);
                    cmd.Parameters.AddWithValue("@Price", product.Price);
                    cmd.Parameters.AddWithValue("@ImageUrl", product.ImageUrl);
                    cmd.Parameters.AddWithValue("@IsOnSale", product.IsOnSale);

                    await cmd.ExecuteNonQueryAsync();
                }
            }

            return Ok(new { message = "Produkti u përditësua me sukses." });
        }
        catch (SqlException sqlEx)
        {
            return StatusCode(500, $"Gabim në bazën e të dhënave: {sqlEx.Message}");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Gabim i brendshëm gjatë përditësimit të produktit: {ex.Message}");
        }
    }

    // DELETE: /api/products/{id}
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin,Company")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        try
        {
            using (var conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await conn.OpenAsync();
                using (var cmd = new SqlCommand("DELETE FROM Products WHERE Id = @Id", conn))
                {
                    cmd.Parameters.AddWithValue("@Id", id);

                    int rowsAffected = await cmd.ExecuteNonQueryAsync();
                    if (rowsAffected == 0)
                    {
                        return NotFound(new { message = "Produkti nuk u gjet." });
                    }
                }
            }

            return Ok(new { message = "Produkti u fshi me sukses." });
        }
        catch (SqlException sqlEx)
        {
            return StatusCode(500, $"Gabim në bazën e të dhënave: {sqlEx.Message}");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Gabim i brendshëm gjatë fshirjes së produktit: {ex.Message}");
        }
    }

}
