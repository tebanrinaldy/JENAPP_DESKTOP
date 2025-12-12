const isElectron = window.location.protocol === "file:";

export const BASE_API_URL = isElectron
  ? "http://localhost:5132"
  : "http://localhost:5132";
