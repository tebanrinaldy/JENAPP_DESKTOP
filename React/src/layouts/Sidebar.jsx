import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import logo from "../assets/logo jenweb.png";

import {
  FiHome,
  FiShoppingCart,
  FiFolder,
  FiBox,
  FiLayers,
  FiBarChart2,
  FiDollarSign,
  FiUsers,
  FiArchive,
  FiLogIn,
} from "react-icons/fi";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">JenApp</h2>
      <img src={logo} alt="Logo de JenApp" className="logo" />

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className="sidebar-btn">
          <FiHome className="icon" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/venta" className="sidebar-btn">
          <FiShoppingCart className="icon" />
          <span>Ventas</span>
        </NavLink>

        <NavLink to="/categorias" className="sidebar-btn">
          <FiFolder className="icon" />
          <span>Categorías</span>
        </NavLink>

        <NavLink to="/productos" className="sidebar-btn">
          <FiBox className="icon" />
          <span>Productos</span>
        </NavLink>

        <NavLink to="/recaudos" className="sidebar-btn">
          <FiDollarSign className="icon" />
          <span>Recaudos M&S</span>
        </NavLink>

        <NavLink to="/movimientos" className="sidebar-btn">
          <FiLayers className="icon" />
          <span>Movimientos</span>
        </NavLink>

        <NavLink to="/cuentas" className="sidebar-btn">
          <FiArchive className="icon" />
          <span>Cuentas</span>
        </NavLink>

        <NavLink to="/fiados" className="sidebar-btn">
          <FiUsers className="icon" />
          <span>Fiados</span>
        </NavLink>

        <NavLink to="/accesos" className="sidebar-btn">
          <FiLogIn className="icon" />
          <span>Comfacesar</span>
        </NavLink>

        <NavLink to="/inventario" className="sidebar-btn">
          <FiArchive className="icon" />
          <span>Inventario</span>
        </NavLink>

        <NavLink to="/reportes-ventas" className="sidebar-btn">
          <FiBarChart2 className="icon" />
          <span>Reportes de Ventas</span>
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;
