import { useEffect, useState } from "react";
import {
  getClientesFiados,
  crearClienteFiado,
  crearFiado,
  crearAbono,
  getDetalleClienteFiado,
} from "../api/fiados";
import notify from "../components/solucionador";

function Fiados() {
  const [clientes, setClientes] = useState([]);

  const [nombreCliente, setNombreCliente] = useState("");
  const [clienteId, setClienteId] = useState(null);
  const [sugerencias, setSugerencias] = useState([]);
  const [deuda, setDeuda] = useState(0);

  const [valorFiado, setValorFiado] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [valorAbono, setValorAbono] = useState("");

  const [detalleCliente, setDetalleCliente] = useState(null);
  const [seleccionando, setSeleccionando] = useState(false);

  useEffect(() => {
    cargarClientes();
  }, []);

  useEffect(() => {
    if (seleccionando) {
      setSeleccionando(false);
      return;
    }

    if (!nombreCliente.trim()) {
      setSugerencias([]);
      setClienteId(null);
      setDeuda(0);
      return;
    }

    const buscar = async () => {
      const data = await getClientesFiados(nombreCliente);
      setSugerencias(data);
    };

    buscar();
  }, [nombreCliente]);

  const cargarClientes = async () => {
    const data = await getClientesFiados();
    setClientes(data);
  };

  const seleccionarSugerencia = (c) => {
    setSeleccionando(true);
    setNombreCliente(c.nombre);
    setClienteId(c.id);
    setDeuda(c.total);
    setSugerencias([]);
    setDetalleCliente(null);
  };

  const limpiarFormulario = () => {
    setNombreCliente("");
    setClienteId(null);
    setSugerencias([]);
    setDeuda(0);
    setValorFiado("");
    setDescripcion("");
    setValorAbono("");
    setDetalleCliente(null);
  };

  const registrarFiado = async () => {
    if (!nombreCliente || !valorFiado || !descripcion) {
      notify("Completa todos los datos del fiado");
      return;
    }

    let id = clienteId;

    if (!id) {
      const nuevo = await crearClienteFiado(nombreCliente);
      id = nuevo.id;
    }

    await crearFiado(id, valorFiado, descripcion);
    notify("Fiado registrado");

    limpiarFormulario();
    await cargarClientes();
  };

  const registrarAbono = async () => {
    if (!clienteId) {
      notify("Selecciona un cliente existente");
      return;
    }

    const monto = Number(valorAbono);

    if (!monto || monto <= 0) {
      notify("Valor de abono inválido");
      return;
    }

    if (monto > deuda) {
      notify("El abono no puede ser mayor a la deuda");
      return;
    }

    await crearAbono(clienteId, monto, false);
    notify("Abono registrado");

    limpiarFormulario();
    await cargarClientes();
  };

  const registrarAbonoTotal = async () => {
    if (!clienteId || deuda <= 0) {
      notify("Cliente sin deuda");
      return;
    }

    await crearAbono(clienteId, null, true);
    notify("Abono total registrado");

    limpiarFormulario();
    await cargarClientes();
  };

  const seleccionarClienteLista = (c) => {
    setNombreCliente(c.nombre);
    setClienteId(c.id);
    setDeuda(c.total);
    setSugerencias([]);

    setDetalleCliente({ nombre: c.nombre, movimientos: [] });

    getDetalleClienteFiado(c.id).then((data) => {
      setDetalleCliente(data);
    });
  };

  return (
    <div className="p-4">
      <h2>Fiados</h2>

      <div className="mb-3 position-relative" style={{ zIndex: 2000 }}>
        <input
          className="form-control"
          placeholder="Nombre del cliente"
          value={nombreCliente}
          onChange={(e) => setNombreCliente(e.target.value)}
        />

        {sugerencias.length > 0 && (
          <ul
            className="list-group position-absolute w-100 shadow"
            style={{ maxHeight: "200px", overflowY: "auto" }}
          >
            {sugerencias.map((c) => (
              <li
                key={c.id}
                className="list-group-item list-group-item-action"
                onClick={() => seleccionarSugerencia(c)}
                style={{ cursor: "pointer" }}
              >
                {c.nombre}
              </li>
            ))}
          </ul>
        )}
      </div>

      {clienteId && (
        <p>
          <strong>Deuda actual:</strong> ${deuda}
        </p>
      )}

      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card p-3">
            <h5 className="text-danger">Fiado</h5>

            <input
              className="form-control mb-2"
              placeholder="Valor fiado"
              type="number"
              value={valorFiado}
              onChange={(e) => setValorFiado(e.target.value)}
            />

            <input
              className="form-control mb-3"
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />

            <button className="btn btn-danger w-100" onClick={registrarFiado}>
              Registrar fiado
            </button>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card p-3">
            <h5 className="text-success">Abono</h5>

            <input
              className="form-control mb-2"
              placeholder="Valor abono"
              type="number"
              value={valorAbono}
              onChange={(e) => setValorAbono(e.target.value)}
              disabled={!clienteId}
            />

            <div className="d-flex gap-2">
              <button
                className="btn btn-warning w-100"
                onClick={registrarAbono}
                disabled={!clienteId}
              >
                Abonar
              </button>
              <button
                className="btn btn-success w-100"
                onClick={registrarAbonoTotal}
                disabled={!clienteId}
              >
                Abono total
              </button>
            </div>
          </div>
        </div>
      </div>

      <h5 className="mt-4">Clientes registrados</h5>
      <ul className="list-group">
        {clientes.map((c) => (
          <li
            key={c.id}
            className="list-group-item d-flex justify-content-between"
            style={{ cursor: "pointer" }}
            onClick={() => seleccionarClienteLista(c)}
          >
            <span>{c.nombre}</span>
            <strong>${c.total}</strong>
          </li>
        ))}
      </ul>

      {detalleCliente && (
        <div className="card mt-3 p-3">
          <h5>Movimientos de {detalleCliente.nombre}</h5>

          <ul className="list-group">
            {detalleCliente.movimientos.map((m) => (
              <li
                key={m.id}
                className={`list-group-item ${
                  m.valor > 0 ? "text-danger" : "text-success"
                }`}
              >
                {m.valor > 0 ? "Fiado" : "Abono"} — ${Math.abs(m.valor)} —{" "}
                {new Date(m.fecha).toLocaleString()}
                {m.descripcion && ` — ${m.descripcion}`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Fiados;
