// Vías de contacto y redes de Clínica Conecta, compartidas por V4 y por las
// páginas legales (que cierran con la misma sección de contacto).

const whatsappMessage = encodeURIComponent('Hola, me gustaría agendar una sesión');
export const whatsappHref = `https://wa.me/34644751041?text=${whatsappMessage}`;
const llamadaMessage = encodeURIComponent(
  'Hola, me gustaría pedir la primera llamada gratuita de 15 minutos',
);
export const llamadaHref = `https://wa.me/34644751041?text=${llamadaMessage}`;
const tarifaMessage = encodeURIComponent('Hola, me gustaría conocer la tarifa de las sesiones');
export const tarifaHref = `https://wa.me/34644751041?text=${tarifaMessage}`;
export const correo = 'riccardijuanpsi@gmail.com';
export const mailtoHref = `mailto:${correo}?subject=Consulta%20desde%20la%20web`;
export const linkedinHref = 'https://www.linkedin.com/in/juaniriccardi';
export const instagramHref = 'https://www.instagram.com/juanriccardi.conecta/';
export const facebookHref = 'https://www.facebook.com/share/1Czzsw5wiS/';

// Icono de sobre (Phosphor) del correo: va entre las redes y en el enlace de la tarjeta.
export const iconoEmail =
  'M224 48H32a8 8 0 0 0-8 8v136a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a8 8 0 0 0-8-8m-20.57 16L128 133.15L52.57 64ZM216 192H40V74.19l82.59 75.71a8 8 0 0 0 10.82 0L216 74.19z';

// Iconos Phosphor (viewBox 256), en línea para no añadir dependencias.
export const redes = [
  {
    nombre: 'WhatsApp',
    href: whatsappHref,
    d: 'm187.58 144.84l-32-16a8 8 0 0 0-8 .5l-14.69 9.8a40.55 40.55 0 0 1-16-16l9.8-14.69a8 8 0 0 0 .5-8l-16-32A8 8 0 0 0 104 64a40 40 0 0 0-40 40a88.1 88.1 0 0 0 88 88a40 40 0 0 0 40-40a8 8 0 0 0-4.42-7.16M152 176a72.08 72.08 0 0 1-72-72a24 24 0 0 1 19.29-23.54l11.48 23L101 118a8 8 0 0 0-.73 7.51a56.47 56.47 0 0 0 30.15 30.15A8 8 0 0 0 138 155l14.61-9.74l23 11.48A24 24 0 0 1 152 176M128 24a104 104 0 0 0-91.82 152.88l-11.35 34.05a16 16 0 0 0 20.24 20.24l34.05-11.35A104 104 0 1 0 128 24m0 192a87.87 87.87 0 0 1-44.06-11.81a8 8 0 0 0-6.54-.67L40 216l12.47-37.4a8 8 0 0 0-.66-6.54A88 88 0 1 1 128 216',
  },
  {
    nombre: 'Instagram',
    href: instagramHref,
    d: 'M128 80a48 48 0 1 0 48 48a48.05 48.05 0 0 0-48-48m0 80a32 32 0 1 1 32-32a32 32 0 0 1-32 32m48-136H80a56.06 56.06 0 0 0-56 56v96a56.06 56.06 0 0 0 56 56h96a56.06 56.06 0 0 0 56-56V80a56.06 56.06 0 0 0-56-56m40 152a40 40 0 0 1-40 40H80a40 40 0 0 1-40-40V80a40 40 0 0 1 40-40h96a40 40 0 0 1 40 40ZM192 76a12 12 0 1 1-12-12a12 12 0 0 1 12 12',
  },
  {
    nombre: 'Facebook',
    href: facebookHref,
    d: 'M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m8 191.63V152h24a8 8 0 0 0 0-16h-24v-24a16 16 0 0 1 16-16h16a8 8 0 0 0 0-16h-16a32 32 0 0 0-32 32v24H96a8 8 0 0 0 0 16h24v63.63a88 88 0 1 1 16 0',
  },
  {
    nombre: 'LinkedIn',
    href: linkedinHref,
    d: 'M216 24H40a16 16 0 0 0-16 16v176a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V40a16 16 0 0 0-16-16m0 192H40V40h176zM96 112v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0m88 28v36a8 8 0 0 1-16 0v-36a20 20 0 0 0-40 0v36a8 8 0 0 1-16 0v-64a8 8 0 0 1 15.79-1.78A36 36 0 0 1 184 140m-84-56a12 12 0 1 1-12-12a12 12 0 0 1 12 12',
  },
  {
    nombre: 'Correo electrónico',
    href: mailtoHref,
    d: iconoEmail,
  },
];

// Icono de WhatsApp del botón de tarifa: el primero de `redes`.
export const iconoWhatsApp = redes[0].d;
