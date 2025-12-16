import { BASE_API_URL } from "./baseurl";

const API_URL = `${BASE_API_URL}/api/movimientos`;

export const getMovimientos = async (fecha = null) => {
  const query = fecha ? `?fecha=${fecha}` : "";

  const res = await fetch(`${API_URL}${query}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("❌ Error al obtener movimientos:", res.status, text);
    throw new Error(text || "Error al obtener movimientos");
  }

  return res.json();
};

export const crearMovimiento = async (movimiento) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
    body: JSON.stringify(movimiento),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("❌ Error al crear movimiento:", res.status, text);
    throw new Error(text || "Error al crear movimiento");
  }

  return res.json();
};

export const reclamarMovimiento = async (id) => {
  const res = await fetch(`${API_URL}/${id}/reclamar`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("❌ Error al reclamar movimiento:", res.status, text);
    throw new Error(text || "Error al reclamar movimiento");
  }

  return res.json();
};
