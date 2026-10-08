import type { Metadata } from 'next';

// /comunidad es una version alternativa de las mismas paginas. Fuera del
// indice para que Google no las tome por contenido duplicado.
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function ComunidadLayout({ children }: { children: React.ReactNode }) {
  return children;
}
