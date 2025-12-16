import { useEffect, useState } from "react";
import {
  getRecibidos,
  createRecibido,
  getEntregados,
  createEntregado,
} from "../api/recaudos";
import notify from "../components/solucionador";

const WHATSAPP_EMPRESA = "573153244758";

function RecaudosInternet() {
  const [recibidos, setRecibidos] = useState([]);
  const [entregados, setEntregados] = useState([]);

  const [clienteNombre, setClienteNombre] = useState("");
  const [valorRecibido, setValorRecibido] = useState("");

  const [valorEntregado, setValorEntregado] = useState("");
  const [metodo, setMetodo] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setRecibidos(await getRecibidos());
    setEntregados(await getEntregados());
  };

  const totalRecibido = recibidos.reduce((a, r) => a + r.valor, 0);
  const totalEntregado = entregados.reduce((a, e) => a + e.valor, 0);
  const saldo = totalRecibido - totalEntregado;

  const registrarRecibido = async (e) => {
    e.preventDefault();

    if (!clienteNombre || valorRecibido <= 0) {
      notify("Datos inválidos");
      return;
    }

    await createRecibido({
      clienteNombre,
      valor: Number(valorRecibido),
    });

    notify("Pago registrado");
    setClienteNombre("");
    setValorRecibido("");
    cargarDatos();
  };

  const registrarEntregado = async (e) => {
    e.preventDefault();

    if (!metodo || valorEntregado <= 0) {
      notify("Datos inválidos");
      return;
    }

    await createEntregado({
      metodo,
      valor: Number(valorEntregado),
    });

    notify("Entrega registrada");
    setMetodo("");
    setValorEntregado("");
    cargarDatos();
  };

  const enviarWhatsapp = (cliente, valor) => {
    const mensaje = `${cliente} $${valor}`;
    window.open(
      `https://wa.me/${WHATSAPP_EMPRESA}?text=${encodeURIComponent(mensaje)}`,
      "_blank"
    );
  };

  return (
    <div className="p-4">
      <h2>Recaudos Internet</h2>
      <p>
        <strong>Saldo:</strong> ${saldo}
      </p>

      <h5>Registrar pago</h5>
      <form onSubmit={registrarRecibido} className="d-flex gap-2 mb-3">
        <input
          className="form-control"
          placeholder="Cliente"
          value={clienteNombre}
          onChange={(e) => setClienteNombre(e.target.value)}
        />
        <input
          type="number"
          className="form-control"
          placeholder="Valor"
          value={valorRecibido}
          onChange={(e) => setValorRecibido(e.target.value)}
        />
        <button className="btn btn-success">Agregar</button>
      </form>

      <ul className="list-group mb-4">
        {recibidos.map((r) => (
          <li
            key={r.id}
            className="list-group-item d-flex justify-content-between"
          >
            <span>
              {r.clienteNombre} – ${r.valor}
            </span>
            <button
              className="btn btn-sm btn-success"
              onClick={() => enviarWhatsapp(r.clienteNombre, r.valor)}
            >
              WhatsApp
            </button>
          </li>
        ))}
      </ul>

      <h5>Registrar entrega</h5>
      <form onSubmit={registrarEntregado} className="d-flex gap-2 mb-3">
        <input
          className="form-control"
          placeholder="Método de entrega"
          value={metodo}
          onChange={(e) => setMetodo(e.target.value)}
        />
        <input
          type="number"
          className="form-control"
          placeholder="Valor entregado"
          value={valorEntregado}
          onChange={(e) => setValorEntregado(e.target.value)}
        />
        <button className="btn btn-primary">Registrar</button>
      </form>

      <ul className="list-group">
        {entregados.map((e) => (
          <li key={e.id} className="list-group-item">
            <strong>{e.metodo}</strong> – ${e.valor}
            <small className="text-muted ms-2">
              ({new Date(e.fecha).toLocaleDateString()})
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecaudosInternet;
