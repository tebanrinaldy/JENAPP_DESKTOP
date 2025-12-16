import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Productos from "./pages/Productos.jsx";
import Venta from "./pages/Venta.jsx";
import Login from "./pages/Login.jsx";
import Categorias from "./pages/Categorias.jsx";
import Inventario from "./pages/Inventario.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import ReporteVenta from "./pages/ReportesVentas.jsx";
import useFocusFix from "./components/useFocusFix.js";
import RecaudosInternet from "./pages/RecaudosInternet.jsx";
import Movimientos from "./pages/Movimientos.jsx";
import Cuentas from "./pages/Cuentas.jsx";
import Fiados from "./pages/Fiados.jsx";
import Accesos from "./pages/Accesos.jsx";

function StartRoute() {
  const isLogged = Boolean(localStorage.getItem("user"));
  return <Navigate to={isLogged ? "/dashboard" : "/login"} replace />;
}

function App() {
  useFocusFix();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<MainLayout />}>
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/productos"
          element={
            <PrivateRoute>
              <Productos />
            </PrivateRoute>
          }
        />
        <Route
          path="/venta"
          element={
            <PrivateRoute>
              <Venta />
            </PrivateRoute>
          }
        />
        <Route
          path="/categorias"
          element={
            <PrivateRoute>
              <Categorias />
            </PrivateRoute>
          }
        />
        <Route
          path="/inventario"
          element={
            <PrivateRoute>
              <Inventario />
            </PrivateRoute>
          }
        />
        <Route
          path="/reportes-ventas"
          element={
            <PrivateRoute>
              <ReporteVenta />
            </PrivateRoute>
          }
        />
        <Route
          path="/recaudos"
          element={
            <PrivateRoute>
              <RecaudosInternet />
            </PrivateRoute>
          }
        />
        <Route
          path="/movimientos"
          element={
            <PrivateRoute>
              <Movimientos />
            </PrivateRoute>
          }
        />
        <Route
          path="/cuentas"
          element={
            <PrivateRoute>
              <Cuentas />
            </PrivateRoute>
          }
        />
        <Route
          path="/fiados"
          element={
            <PrivateRoute>
              <Fiados />
            </PrivateRoute>
          }
        />
        <Route
          path="/accesos"
          element={
            <PrivateRoute>
              <Accesos />
            </PrivateRoute>
          }
        />
      </Route>

      <Route path="/" element={<StartRoute />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
