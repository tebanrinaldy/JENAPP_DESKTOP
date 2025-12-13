import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createuser, getusers } from "../api/users";
import "../css/Register.css";
import notify from "../components/solucionador";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleregister = async (e) => {
    e.preventDefault();

    try {
      const users = await getusers();
      const userexists = users.some((u) => u.username === username);

      if (userexists) {
        notify("ERROR... El usuario ya existe");
        return;
      }

      const result = await createuser({
        Username: username,
        Password: password,
      });

      if (result) {
        notify("Usuario registrado con éxito");
        navigate("/login");
      } else {
        notify("Error al registrar usuario");
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      notify("Ocurrió un error al registrar el usuario");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Registrar nuevo usuario</h2>
        <form onSubmit={handleregister}>
          <label>Usuario</label>
          <input
            type="text"
            placeholder="Ingresa el nuevo usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label>Contraseña</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Registrar</button>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="back-button"
          >
            ← Volver al inicio de sesión
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
