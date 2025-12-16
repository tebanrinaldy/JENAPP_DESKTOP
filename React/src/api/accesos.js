import { BASE_API_URL } from "./baseurl";

const API_URL = `${BASE_API_URL}/api/acceso`;

export const getaccesos = async () => {
  const res = await fetch(API_URL, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return res.json();
};

export const createaccesos = async (acceso) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
    body: JSON.stringify(acceso),
  });
  return res.json();
};

export const updateaccesos = async (id, acceso) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
    body: JSON.stringify(acceso),
  });
  return res.json();
};

export const deleteaccesos = async (id) => {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
};
