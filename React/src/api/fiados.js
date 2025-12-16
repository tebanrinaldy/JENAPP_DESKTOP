import { BASE_API_URL } from "./baseurl";

const API_URL = `${BASE_API_URL}/api/fiados`;

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${sessionStorage.getItem("token")}`,
});

export const getClientesFiados = async (search = "") => {
  const res = await fetch(`${API_URL}/clientes?search=${search}`, {
    headers: headers(),
  });
  return res.json();
};

export const crearClienteFiado = async (nombre) => {
  const res = await fetch(`${API_URL}/clientes`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(nombre),
  });
  return res.json();
};

export const getDetalleClienteFiado = async (id) => {
  const res = await fetch(`${API_URL}/clientes/${id}`, {
    headers: headers(),
  });
  return res.json();
};

export const crearFiado = async (clienteId, valor, descripcion) => {
  const params = new URLSearchParams({
    clienteId,
    valor,
    descripcion,
  });

  const res = await fetch(`${API_URL}/fiado?${params.toString()}`, {
    method: "POST",
    headers: headers(),
  });

  return res.json();
};

export const crearAbono = async (clienteId, valor, abonoTotal) => {
  const params = new URLSearchParams();
  params.append("clienteId", clienteId);
  params.append("abonoTotal", abonoTotal);

  if (!abonoTotal) {
    params.append("valor", valor);
  }

  const res = await fetch(`${API_URL}/abono?${params.toString()}`, {
    method: "POST",
    headers: headers(),
  });

  return res.json();
};
