import { useEffect, useState } from "react";
import { getCuentas, crearCuenta } from "../api/cuentas";

function Cuentas() {
  const [cuentas, setCuentas] = useState([]);
  const [nombre, setNombre] = useState("");

  const cargar = async () => {
    const data = await getCuentas();
    setCuentas(data);
  };

  useEffect(() => {
    cargar();
  }, []);

  const guardar = async () => {
    if (!nombre.trim()) return;
    await crearCuenta(nombre);
    setNombre("");
    cargar();
  };

  return (
    <div className="container mb-5">
      <h4>Cuentas</h4>

      <div className="card mb-3">
        <div className="card-body d-flex gap-2">
          <input
            className="form-control"
            placeholder="Nombre de la cuenta"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <button className="btn btn-primary" onClick={guardar}>
            Crear
          </button>
        </div>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
          </tr>
        </thead>
        <tbody>
          {cuentas.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.nombre}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Cuentas;
