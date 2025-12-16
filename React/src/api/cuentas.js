import { BASE_API_URL } from "./baseurl";

const API_URL = `${BASE_API_URL}/api/cuentas`;

export const getCuentas = async () => {
  const res = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("❌ Error al obtener cuentas:", res.status, text);
    throw new Error(text || "Error al obtener cuentas");
  }

  return res.json();
};

export const crearCuenta = async (nombre) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
    body: JSON.stringify({ nombre }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("❌ Error al crear cuenta:", res.status, text);
    throw new Error(text || "Error al crear cuenta");
  }

  return res.json();
};
