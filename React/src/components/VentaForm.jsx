import { useState } from "react";

function VentaForm({ onConfirm }) {
  const [client, setClient] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({
      client,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <div className="mb-3">
        <label className="form-label">Nombre del cliente</label>
        <input
          type="text"
          className="form-control"
          value={client}
          onChange={(e) => setClient(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-outline-primary w-100">
        Confirmar datos del cliente
      </button>
    </form>
  );
}

export default VentaForm;
