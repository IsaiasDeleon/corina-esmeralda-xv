// Personaliza los datos aquí. Las rutas de fotos y audio son relativas a esta carpeta.
export const invitation = {
  template: 'esmeralda',
  eventType: 'Mis XV Años',
  celebrant: 'Corina Esmeralda',
  date: '2026-10-31',
  timeZone: 'America/Mexico_City',
  colors: { primary: '#14463c', accent: '#009473' },
  family: {
    mother: 'Olga Rodriguez',
    godmother: 'Sara Gómez Bravo',
    godfather: 'Valentin Blanco Gomez',
  },
  images: {
    hero: './assets/corina/hero/Co1.jpeg', // Ejemplo: './assets/corina/hero/retrato.webp'
  },
  gallery: [
    // Hasta cinco: { src: './assets/corina/gallery/foto-01.webp', alt: 'Corina en ...' }
  ],
  ceremony: {
    name: 'Iglesia de la Santa Cruz en Xoconoxtle',
    time: '2:00 PM',
    mapUrl: '',
    image: '',
  },
  reception: {
    name: 'Salón en Campo de Béisbol Rancho los Rivera',
    time: '',
    mapUrl: '',
    image: '',
  },
  itinerary: [
    { title: 'Ceremonia Religiosa', time: '2:00 PM', icon: 'ceremony' },
    { title: 'Recepción', time: '', icon: 'reception' },
    { title: 'Bienvenida', time: '', icon: 'welcome' },
    { title: 'Cena', time: '', icon: 'dinner' },
    { title: 'Vals', time: '', icon: 'waltz' },
    { title: 'Baile y celebración', time: '', icon: 'dance' },
  ],
  dressCode: {
    title: 'Vestimenta libre',
    description: 'Queremos que disfrutes este día con nosotros. Te invitamos a asistir con el atuendo con el que te sientas más cómodo y listo para celebrar.',
  },
  gift: { type: 'Lluvia de sobres' },
  music: { src: '' },
  rsvp: {
    phone: '', // Código de país y número, solo dígitos. Ejemplo: 52...
    message: 'Hola, confirmo mi asistencia a los XV años de Corina Esmeralda el 31 de octubre de 2026.',
    deadline: '',
  },
};
