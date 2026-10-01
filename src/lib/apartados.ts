// Apartados de las páginas con índice (legales y explicativas). De la misma
// lista salen el índice y el título de cada sección, así que no pueden
// desincronizarse. Las legales van numeradas (`numerar`); las explicativas, no
// (`indexar`).

export interface Apartado {
  id: string;
  titulo: string;
  numero?: number;
}

type Lista = readonly { id: string; titulo: string }[];

function conIndice<T extends Lista>(apartados: Apartado[]) {
  const porId = Object.fromEntries(apartados.map((a) => [a.id, a])) as Record<
    T[number]['id'],
    Apartado
  >;
  return { lista: apartados, porId };
}

export function numerar<const T extends Lista>(lista: T) {
  return conIndice<T>(lista.map((a, i) => ({ ...a, numero: i + 1 })));
}

export function indexar<const T extends Lista>(lista: T) {
  return conIndice<T>(lista.map((a) => ({ ...a })));
}
