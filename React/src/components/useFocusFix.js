import { useEffect } from "react";

export default function useFocusFix() {
  useEffect(() => {
    // 🔴 FIX REAL: matar backdrops de Bootstrap que roban foco
    const style = document.createElement("style");
    style.innerHTML = `
      .modal-backdrop,
      .offcanvas-backdrop,
      .toast-backdrop {
        pointer-events: none !important;
      }
    `;
    document.head.appendChild(style);

    // 🔴 FIX EXTRA: asegurar foco real al hacer click en inputs
    const forceFocus = (e) => {
      const el = e.target;
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
        el.focus();
      }
    };

    document.addEventListener("mousedown", forceFocus, true);

    return () => {
      document.head.removeChild(style);
      document.removeEventListener("mousedown", forceFocus, true);
    };
  }, []);
}
