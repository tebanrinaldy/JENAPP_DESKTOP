import { useState, useEffect } from "react";
import {
  getaccesos,
  createaccesos,
  updateaccesos,
  deleteaccesos,
} from "../api/accesos";
import notify, { confirmdialog } from "../components/solucionador";

function Accesos() {
  const [accesos, setAccesos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [cedula, setCedula] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    cargarAccesos();
  }, []);

  const cargarAccesos = async () => {
    const data = await getaccesos();
    setAccesos(data);
  };

  const handleEditar = (acceso) => {
    setEditando(acceso);
    setNombre(acceso.nombre);
    setCedula(acceso.cedula);
    setContrasena(acceso.contrasena);
  };

  const handleCancelar = () => {
    setEditando(null);
    setNombre("");
    setCedula("");
    setContrasena("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      nombre: nombre.toUpperCase(),
      cedula,
      contrasena,
    };

    if (editando) {
      await updateaccesos(editando.id, payload);
      notify("Acceso actualizado con éxito");
      setEditando(null);
    } else {
      await createaccesos(payload);
      notify("Acceso creado con éxito");
    }

    handleCancelar();
    await cargarAccesos();
  };

  const eliminarAcceso = async (id) => {
    const confirmar = await confirmdialog(
      "¿Estás seguro de que deseas eliminar este acceso?"
    );
    if (!confirmar) return;

    await deleteaccesos(id);
    notify("Acceso eliminado con éxito");
    await cargarAccesos();
  };

  const filtrados = accesos
    .filter((a) => a.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    .sort((a, b) => a.nombre.localeCompare(b.nombre));

  return (
    <div className="accesos-page p-4">
      <h2>Accesos</h2>

      <form onSubmit={handleSubmit} className="d-flex gap-2 mb-4 flex-wrap">
        <input
          type="text"
          className="form-control"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value.toUpperCase())}
          required
        />

        <input
          type="text"
          className="form-control"
          placeholder="Cédula"
          value={cedula}
          onChange={(e) => {
            if (/^\d*$/.test(e.target.value)) {
              setCedula(e.target.value);
            }
          }}
          required
        />

        <input
          type="text"
          className="form-control"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
        />

        {editando ? (
          <>
            <button type="submit" className="btn btn-warning">
              Guardar cambios
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancelar}
            >
              Cancelar
            </button>
          </>
        ) : (
          <button type="submit" className="btn btn-success">
            ➕ Crear
          </button>
        )}
      </form>

      <input
        className="form-control mb-3"
        placeholder="Buscar por nombre"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <ul className="list-group">
        {filtrados.map((a) => (
          <li
            key={a.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{a.nombre}</strong>
              <div className="small">Cédula: {a.cedula}</div>
              <div className="small">Contraseña: {a.contrasena}</div>
            </div>

            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-light"
                onClick={() => navigator.clipboard.writeText(a.cedula)}
              >
                📋
              </button>
              <button
                className="btn btn-sm btn-light"
                onClick={() => navigator.clipboard.writeText(a.contrasena)}
              >
                📋
              </button>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => handleEditar(a)}
              >
                Editar
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => eliminarAcceso(a.id)}
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Accesos;
