// Constantes de estilo que se repiten en varios componentes.

// Curva con masa y anillo de foco visible, para enlaces y botones.
export const curva = 'ease-[cubic-bezier(0.32,0.72,0,1)]';
export const foco =
  'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-400';

// Enlace dentro de un texto sobre fondo claro: subrayado dorado.
export const enlace = `rounded-sm underline decoration-gold-400 underline-offset-4 transition-colors duration-300 ${curva} hover:text-navy-600 ${foco}`;

// Texto corrido y subtítulos dentro de un <Apartado /> (páginas explicativas).
export const parrafo = 'mt-4 leading-relaxed text-pretty text-ink/80';
export const subtitulo = 'mt-8 font-serif text-lg font-semibold text-balance text-navy-800';
// Tarjeta clara dentro de la columna de texto.
export const tarjeta = 'rounded-2xl border border-navy-100 bg-cream-50 p-6';
