export default function notify(msg) {
  const div = document.createElement("div");
  div.innerText = msg;
  div.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #198754;
    color: white;
    padding: 10px 16px;
    border-radius: 6px;
    z-index: 9999;
    font-size: 14px;
  `;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 2000);
}

export function confirmdialog(message) {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    `;

    const box = document.createElement("div");
    box.style.cssText = `
      background: white;
      padding: 20px;
      border-radius: 8px;
      width: 320px;
      box-shadow: 0 10px 30px rgba(0,0,0,.3);
      text-align: center;
    `;

    box.innerHTML = `
      <p style="margin-bottom: 20px;">${message}</p>
      <div style="display:flex;gap:10px;justify-content:center">
        <button id="ok" style="padding:6px 14px;">Sí</button>
        <button id="cancel" style="padding:6px 14px;">Cancelar</button>
      </div>
    `;

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    box.querySelector("#ok").onclick = () => {
      cleanup();
      resolve(true);
    };

    box.querySelector("#cancel").onclick = () => {
      cleanup();
      resolve(false);
    };

    function cleanup() {
      document.body.removeChild(overlay);
    }
  });
}
