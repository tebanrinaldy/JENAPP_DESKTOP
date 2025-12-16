import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/users";
import "../css/Login.css";
import notify from "../components/solucionador";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handlelogin = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser({ username, password });
      notify(res.message);
      sessionStorage.setItem("user", JSON.stringify(res.user));
      sessionStorage.setItem("token", res.token);
      navigate("/dashboard");
    } catch (error) {
      notify(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Iniciar sesión</h2>

        <form onSubmit={handlelogin}>
          <label>Usuario</label>
          <input
            type="text"
            placeholder="Ingresa tu usuario"
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

          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
