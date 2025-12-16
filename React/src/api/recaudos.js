import { BASE_API_URL } from "./baseurl";

const RECIBIDOS_URL = `${BASE_API_URL}/api/recibidos`;
const ENTREGADOS_URL = `${BASE_API_URL}/api/entregados`;

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${sessionStorage.getItem("token")}`,
});

export const getRecibidos = async () => {
  const res = await fetch(RECIBIDOS_URL, { headers: headers() });
  if (!res.ok) return [];
  return res.json();
};

export const createRecibido = async (data) => {
  const res = await fetch(RECIBIDOS_URL, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear recibido");
  return res.json();
};

export const getEntregados = async () => {
  const res = await fetch(ENTREGADOS_URL, { headers: headers() });
  if (!res.ok) return [];
  return res.json();
};

export const createEntregado = async (data) => {
  const res = await fetch(ENTREGADOS_URL, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear entregado");
  return res.json();
};
