import { useEffect } from "react";

/**
 * Meta por ruta en la SPA (pulido post-incidente).
 *
 * index.html trae el title/description/canonical del home; sin esto, /reservar
 * y los legales le dicen a Google que son duplicados del home (canonical fijo).
 * Cada página llama usarMeta() al montar y ajusta los tres en el <head>.
 */
const BASE = "https://condorsky.co";

export function usarMeta({ titulo, descripcion, ruta }) {
  useEffect(() => {
    if (titulo) document.title = titulo;
    if (ruta != null) {
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) canonical.setAttribute("href", BASE + ruta);
    }
    if (descripcion) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", descripcion);
    }
  }, [titulo, descripcion, ruta]);
}
