using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Webapi.Data;
using Webapi.Models;
using Webapi.Repositories;
using Webapi.Services;
using BCrypt.Net;
using Webapi;
using Microsoft.AspNetCore.Authorization;

namespace Webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {

        private readonly Connectioncontextdb _context;
        private readonly JwtTokensGenerator _jwtTokensGenerator;

        public UsersController(Connectioncontextdb context, JwtTokensGenerator jwtTokensGenerator)
        {
            _context = context;
            _jwtTokensGenerator = jwtTokensGenerator;
        }
             
        // POST: api/users/Login 
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto login)
        {
            if (login.Username != "admin" || login.Password != "admin")
                return Unauthorized("Usuario o contraseña incorrectos");

            var token = _jwtTokensGenerator.GenerateToken("admin");

            return Ok(new
            {
                message = "Inicio de sesión exitoso",
                user = new
                {
                    Id = 1,
                    Username = "admin"
                },
                token
            });
        }

        public class LoginDto
        {
            public string Username { get; set; }
            public string Password { get; set; }
        }
    }
}

