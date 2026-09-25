// Constantes de estilo que se repiten en varios componentes.

// Curva con masa y anillo de foco visible, para enlaces y botones.
export const curva = 'ease-[cubic-bezier(0.32,0.72,0,1)]';
export const foco =
  'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-400';

// Enlace dentro de un texto sobre fondo claro: subrayado dorado.
export const enlace = `rounded-sm underline decoration-gold-400 underline-offset-4 transition-colors duration-300 ${curva} hover:text-navy-600 ${foco}`;
