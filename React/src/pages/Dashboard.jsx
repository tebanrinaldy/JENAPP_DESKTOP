import { useEffect, useState } from "react";
import { getproductos } from "../api/productos";
import { getMovimientos } from "../api/movimientos";
import { getCuentas } from "../api/cuentas";
import { getRecibidos, getEntregados } from "../api/recaudos";
import "../css/Dashboard.css";

function Dashboard() {
  const [productos, setProductos] = useState([]);
  const [cuentas, setCuentas] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [recibidos, setRecibidos] = useState([]);
  const [entregados, setEntregados] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        setProductos(await getproductos());
        setCuentas(await getCuentas());
        setMovimientos(await getMovimientos());
        setRecibidos(await getRecibidos());
        setEntregados(await getEntregados());
      } catch (e) {
        console.error("Error cargando dashboard", e);
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, []);

  const stockMinimoPorDefecto = 5;

  const productosBajoStock = productos.filter((p) => {
    const minimo = p.stockMin ?? stockMinimoPorDefecto;
    return (p.stock ?? 0) <= minimo;
  });

  const disponibleCuenta = (idCuenta) => {
    return movimientos
      .filter((m) => m.idCuenta === idCuenta)
      .reduce((acc, m) => {
        if (m.tipo === "INGRESO") return acc + m.monto;
        if (m.tipo === "ENVIO") return acc - m.monto;
        return acc;
      }, 0);
  };

  const totalRecibido = recibidos.reduce((a, r) => a + r.valor, 0);
  const totalEntregado = entregados.reduce((a, e) => a + e.valor, 0);
  const saldoRecaudo = totalRecibido - totalEntregado;

  const coloresCuentas = [
    "stat-card-primary",
    "stat-card-secondary",
    "stat-card-neutral",
    "stat-card-alert",
    "stat-card-info",
    "stat-card-success",
  ];

  if (cargando) return <p className="p-4">Cargando dashboard...</p>;

  return (
    <div className="dashboard-container">
      <div className="container-fluid py-4">
        <h2 className="fw-bold mb-4">Dashboard general</h2>

        <h5 className="mb-3">Disponible por cuentas</h5>

        <div className="row g-3 mb-5">
          {cuentas.map((c) => {
            const disponible = disponibleCuenta(c.id);
            const colorClase = coloresCuentas[c.id % coloresCuentas.length];

            return (
              <div key={c.id} className="col-12 col-md-6 col-lg-3">
                <div className={`stat-card ${colorClase} h-100`}>
                  <p className="stat-label">{c.nombre}</p>
                  <h3
                    className={
                      disponible >= 0
                        ? "stat-value text-white"
                        : "stat-value text-warning"
                    }
                  >
                    ${disponible.toLocaleString("es-CO")}
                  </h3>
                  <span className="stat-caption">Disponible actual</span>
                </div>
              </div>
            );
          })}

          {cuentas.length === 0 && (
            <p className="text-muted">No hay cuentas registradas.</p>
          )}
        </div>

        <div className="row g-3 mb-4">
          <div className="col-12 col-md-6 col-lg-3">
            <div className="stat-card stat-card-primary">
              <p className="stat-label">Saldo recaudo</p>
              <h3 className="stat-value">
                ${saldoRecaudo.toLocaleString("es-CO")}
              </h3>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-3">
            <div className="stat-card stat-card-alert">
              <p className="stat-label">Productos por agotarse</p>
              <h3 className="stat-value">{productosBajoStock.length}</h3>
            </div>
          </div>
        </div>

        <h5 className="mb-3">Productos por agotarse</h5>

        <div className="row g-3">
          {productosBajoStock.length > 0 ? (
            productosBajoStock.map((p) => (
              <div key={p.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div className="soft-card stock-card stock-card-low h-100">
                  <h6 className="mb-1">{p.name}</h6>
                  <p className="mb-0">
                    Stock: <strong>{p.stock}</strong>
                  </p>
                  <small className="text-muted">
                    Mínimo: {p.stockMin ?? stockMinimoPorDefecto}
                  </small>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted">No hay productos por agotarse.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
