// Apartados numerados de las páginas legales. De la misma lista salen el
// índice y el título de cada sección, así que no pueden desincronizarse.

export interface Apartado {
  id: string;
  titulo: string;
  numero: number;
}

export function numerar<const T extends readonly { id: string; titulo: string }[]>(lista: T) {
  const numerados: Apartado[] = lista.map((a, i) => ({ ...a, numero: i + 1 }));
  const porId = Object.fromEntries(numerados.map((a) => [a.id, a])) as Record<
    T[number]['id'],
    Apartado
  >;
  return { lista: numerados, porId };
}
