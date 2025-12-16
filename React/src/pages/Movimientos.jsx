import { useEffect, useState } from "react";
import {
  getMovimientos,
  crearMovimiento,
  reclamarMovimiento,
} from "../api/movimientos";
import { getCuentas } from "../api/cuentas";
import Notify from "../components/solucionador";

function Movimientos() {
  const [movimientos, setMovimientos] = useState([]);
  const [cuentas, setCuentas] = useState([]);

  const [idCuentaIngreso, setIdCuentaIngreso] = useState("");
  const [descripcionIngreso, setDescripcionIngreso] = useState("");
  const [montoIngreso, setMontoIngreso] = useState("");

  const [idCuentaEnvio, setIdCuentaEnvio] = useState("");
  const [montoEnvio, setMontoEnvio] = useState("");

  const [notify, setNotify] = useState(null);

  const cargar = async () => {
    try {
      const data = await getMovimientos();
      setMovimientos(data);
    } catch {
      setNotify({ type: "error", message: "Error cargando movimientos" });
    }
  };

  useEffect(() => {
    getCuentas().then(setCuentas);
    cargar();
  }, []);

  const disponibleCuenta = (idCuenta) => {
    return movimientos
      .filter((m) => m.idCuenta === idCuenta)
      .reduce((acc, m) => {
        if (m.tipo === "INGRESO") return acc + m.monto;
        if (m.tipo === "ENVIO") return acc - m.monto;
        return acc;
      }, 0);
  };

  const registrarIngreso = async () => {
    if (!idCuentaIngreso || !montoIngreso || !descripcionIngreso) return;

    try {
      await crearMovimiento({
        idCuenta: idCuentaIngreso,
        tipo: "INGRESO",
        descripcion: descripcionIngreso,
        monto: parseFloat(montoIngreso),
      });

      setIdCuentaIngreso("");
      setDescripcionIngreso("");
      setMontoIngreso("");
      cargar();
      setNotify({ type: "success", message: "Ingreso registrado" });
    } catch {
      setNotify({ type: "error", message: "No se pudo registrar ingreso" });
    }
  };

  const registrarEnvio = async () => {
    if (!idCuentaEnvio || !montoEnvio) return;

    const disponible = disponibleCuenta(parseInt(idCuentaEnvio));
    if (parseFloat(montoEnvio) > disponible) {
      setNotify({
        type: "error",
        message: "El disponible no alcanza para este envío",
      });
      return;
    }

    try {
      await crearMovimiento({
        idCuenta: idCuentaEnvio,
        tipo: "ENVIO",
        descripcion: "ENVIO",
        monto: parseFloat(montoEnvio),
      });

      setIdCuentaEnvio("");
      setMontoEnvio("");
      cargar();
      setNotify({ type: "success", message: "Envío registrado" });
    } catch {
      setNotify({ type: "error", message: "No se pudo registrar envío" });
    }
  };

  const reclamar = async (id) => {
    try {
      await reclamarMovimiento(id);
      setMovimientos((prev) =>
        prev.map((m) => (m.id === id ? { ...m, estado: true } : m))
      );
      setNotify({ type: "success", message: "Ingreso reclamado" });
    } catch {
      setNotify({ type: "error", message: "No se pudo reclamar" });
    }
  };

  return (
    <div className="container">
      {notify && <Notify {...notify} onClose={() => setNotify(null)} />}

      <h3 className="mb-4 fw-bold">Cuentas</h3>

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-header fw-semibold">Registrar Ingreso</div>
            <div className="card-body row g-2">
              <div className="col-12">
                <select
                  className="form-select"
                  value={idCuentaIngreso}
                  onChange={(e) => setIdCuentaIngreso(e.target.value)}
                >
                  <option value="">Cuenta</option>
                  {cuentas.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12">
                <input
                  className="form-control"
                  placeholder="Descripción"
                  value={descripcionIngreso}
                  onChange={(e) => setDescripcionIngreso(e.target.value)}
                />
              </div>

              <div className="col-12">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Monto"
                  value={montoIngreso}
                  onChange={(e) => setMontoIngreso(e.target.value)}
                />
              </div>

              <div className="col-12">
                <button
                  className="btn btn-success w-100"
                  onClick={registrarIngreso}
                >
                  Guardar Ingreso
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-header fw-semibold">Registrar Envío</div>
            <div className="card-body row g-2">
              <div className="col-12">
                <select
                  className="form-select"
                  value={idCuentaEnvio}
                  onChange={(e) => setIdCuentaEnvio(e.target.value)}
                >
                  <option value="">Cuenta</option>
                  {cuentas.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12">
                <input className="form-control" value="ENVIO" disabled />
              </div>

              <div className="col-12">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Monto"
                  value={montoEnvio}
                  onChange={(e) => setMontoEnvio(e.target.value)}
                />
              </div>

              <div className="col-12">
                <button
                  className="btn btn-primary w-100"
                  onClick={registrarEnvio}
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {cuentas.map((cuenta) => {
        const movs = movimientos.filter((m) => m.idCuenta === cuenta.id);
        const disponible = disponibleCuenta(cuenta.id);

        return (
          <div key={cuenta.id} className="card shadow-sm mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <span className="fw-bold">{cuenta.nombre}</span>
              <span
                className={
                  disponible >= 0
                    ? "fw-bold text-success"
                    : "fw-bold text-danger"
                }
              >
                Disponible: ${disponible}
              </span>
            </div>

            <div className="card-body p-0">
              <table className="table table-bordered mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Tipo</th>
                    <th>Descripción</th>
                    <th>Monto</th>
                    <th>Estado</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {movs.map((m) => (
                    <tr
                      key={m.id}
                      className={
                        m.tipo === "ENVIO"
                          ? "table-primary"
                          : m.estado
                          ? "table-success"
                          : "table-warning"
                      }
                    >
                      <td>{m.tipo}</td>
                      <td>{m.descripcion}</td>
                      <td>${m.monto}</td>
                      <td>
                        {m.tipo === "ENVIO"
                          ? "ENVIADO"
                          : m.estado
                          ? "RECLAMADO"
                          : "PENDIENTE"}
                      </td>
                      <td>
                        {m.tipo === "INGRESO" && !m.estado && (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => reclamar(m.id)}
                          >
                            Reclamar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {movs.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center text-muted">
                        Sin movimientos
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Movimientos;
