import { BASE_API_URL } from "./baseurl";

const API_URL = `${BASE_API_URL}/api/Users`;

export const loginUser = async (credentials) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      Username: credentials.username,
      Password: credentials.password,
    }),
  });

  if (!res.ok) {
    throw new Error("Usuario o contraseña incorrectos");
  }

  const data = await res.json();

  // 🔑 GUARDAR TOKEN
  sessionStorage.setItem("token", data.token);

  return data;
};
