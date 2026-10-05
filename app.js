import { invitation } from './config.js';

const $ = (selector) => document.querySelector(selector);
const pad = (number) => String(number).padStart(2, '0');
const eventDay = new Date(`${invitation.date}T12:00:00-06:00`);
const dateParts = invitation.date.split('-');
const displayDate = `${dateParts[2]} · ${dateParts[1]} · ${dateParts[0]}`;
const month = new Intl.DateTimeFormat('es-MX', { month: 'long', timeZone: invitation.timeZone }).format(eventDay).toUpperCase();
const weekday = new Intl.DateTimeFormat('es-MX', { weekday: 'long', timeZone: invitation.timeZone }).format(eventDay).toUpperCase();
const fields = {
  celebrant: invitation.celebrant,
  dateShort: displayDate,
  day: dateParts[2], month, year: dateParts[0], weekday,
  mother: invitation.family.mother,
  godmother: invitation.family.godmother,
  godfather: invitation.family.godfather,
  ceremonyName: invitation.ceremony.name,
  ceremonyTime: invitation.ceremony.time,
  receptionName: invitation.reception.name,
  dressTitle: invitation.dressCode.title.toUpperCase(),
  dressDescription: invitation.dressCode.description,
};
for (const [key, value] of Object.entries(fields)) {
  document.querySelectorAll(`[data-field="${key}"]`).forEach((element) => { element.textContent = value; });
}
document.title = `Esmeralda — XV Años | ${invitation.celebrant}`;
document.querySelector('meta[property="og:title"]').content = document.title;
document.querySelector('meta[name="description"]').content = `Una invitación elegante para celebrar los XV años de ${invitation.celebrant}.`;

function photoBackground(selector, src, alt) {
  if (!src) return;
  const element = $(selector);
  element.style.backgroundImage = `url(${JSON.stringify(src)})`;
  element.classList.add('has-photo');
  element.setAttribute('aria-label', alt);
}
photoBackground('#hero-art .art-arch', invitation.images.hero, `Retrato de ${invitation.celebrant}`);
if (invitation.images.hero) {
  $('#hero-art').classList.add('has-photo');
  $('#hero-art').setAttribute('aria-label', `Retrato de ${invitation.celebrant}`);
}
photoBackground('#ceremony-image', invitation.ceremony.image, `Fotografía de ${invitation.ceremony.name}`);
photoBackground('#reception-image', invitation.reception.image, `Fotografía de ${invitation.reception.name}`);

function addLocationAction(target, url) {
  const container = $(target);
  if (url && /^https:\/\//i.test(url)) {
    const link = document.createElement('a');
    link.className = 'button button-outline';
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Ver ubicación ↗';
    container.append(link);
  } else {
    const note = document.createElement('span');
    note.className = 'unavailable';
    note.textContent = 'Ubicación por confirmar';
    container.append(note);
  }
}
addLocationAction('#ceremony-map', invitation.ceremony.mapUrl);
addLocationAction('#reception-map', invitation.reception.mapUrl);
if (invitation.reception.time) {
  const receptionTime = $('#reception-time');
  receptionTime.textContent = invitation.reception.time;
  receptionTime.hidden = false;
}

const gallery = invitation.gallery.slice(0, 5);
const galleryGrid = $('#gallery-grid');
if (gallery.length) {
  gallery.forEach((photo, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'gallery-item reveal';
    button.setAttribute('aria-label', `Abrir fotografía ${index + 1}: ${photo.alt}`);
    const image = document.createElement('img');
    image.src = photo.src;
    image.alt = photo.alt;
    image.loading = 'lazy';
    image.decoding = 'async';
    button.append(image);
    button.addEventListener('click', () => openLightbox(index, button));
    galleryGrid.append(button);
  });
} else {
  ['El comienzo de una historia', 'Pequeños instantes', 'Una nueva etapa'].forEach((caption, index) => {
    const placeholder = document.createElement('div');
    placeholder.className = 'gallery-placeholder reveal';
    const title = document.createElement('span');
    title.textContent = caption;
    const note = document.createElement('small');
    note.textContent = `Fotografía ${pad(index + 1)} por añadir`;
    placeholder.append(title, note);
    galleryGrid.append(placeholder);
  });
  const note = document.createElement('p');
  note.className = 'gallery-note';
  note.textContent = 'Las fotografías de Corina se añadirán próximamente.';
  galleryGrid.after(note);
}

const iconPaths = {
  ceremony: '<path d="M12 67V38l30-17 30 17v29M18 66h48M32 66V46h20v20M42 21V10M35 15h14M22 39h40"/><path d="M10 67h64M24 47v7M60 47v7"/>',
  reception: '<path d="M12 21h25l-3 18c-2 10-7 15-10 15s-8-5-10-15l-2-18ZM24 54v15M16 69h16M47 21h25l-3 18c-2 10-7 15-10 15s-8-5-10-15l-2-18ZM59 54v15M51 69h16M14 36h21M49 36h21"/>',
  welcome: '<path d="M16 70V35c0-15 12-25 26-25s26 10 26 25v35M26 70V35c0-9 7-16 16-16s16 7 16 16v35M42 38v32M16 70h52M34 44l-3 3 3 3M50 44l3 3-3 3"/>',
  dinner: '<path d="M10 54c1-19 14-31 32-31s31 12 32 31H10ZM7 59h70M29 69h26M42 23v-7M38 16h8M16 35l4-5M68 35l-4-5"/>',
  waltz: '<path d="M42 16c-6 0-10 4-10 9s4 8 10 8 10-3 10-8-4-9-10-9ZM32 34l-10 18 10 5 7-12-5 20M52 34l10 18-10 5-7-12 5 20M34 65c-5 5-10 10-13 13M50 65c5 5 10 10 13 13M32 57c7 4 13 4 20 0"/>',
  dance: '<path d="M22 17v40c-2-2-5-3-8-2-6 1-9 5-8 9s6 6 11 5c5-1 8-4 8-8V27l36-8v31c-2-2-5-3-8-2-6 1-9 5-8 9s6 6 11 5c5-1 8-4 8-8V11L22 20M70 66l3 5M11 14l-3-5M72 29l6-2"/>',
};
invitation.itinerary.forEach((item, index) => {
  const li = document.createElement('li');
  li.style.setProperty('--delay', `${Math.min(index * 0.17, 0.85)}s`);
  const illustration = document.createElement('div');
  illustration.className = 'timeline-illustration';
  illustration.setAttribute('aria-hidden', 'true');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 84 84');
  svg.innerHTML = iconPaths[item.icon] || iconPaths.welcome;
  illustration.append(svg);
  const marker = document.createElement('span');
  marker.className = 'marker';
  marker.setAttribute('aria-hidden', 'true');
  const detail = document.createElement('div');
  detail.className = 'timeline-detail';
  const title = document.createElement('h3');
  title.textContent = item.title;
  detail.append(title);
  if (item.time) {
    const time = document.createElement('time');
    time.textContent = item.time;
    detail.append(time);
  }
  li.append(illustration, marker, detail);
  $('#timeline').append(li);
});

const deadline = $('#rsvp-deadline');
if (invitation.rsvp.deadline) {
  deadline.textContent = `Confirma antes del ${invitation.rsvp.deadline}`;
  deadline.hidden = false;
}
const phone = invitation.rsvp.phone.replace(/\D/g, '');
if (phone) {
  const link = document.createElement('a');
  link.className = 'button';
  link.href = `https://wa.me/${phone}?text=${encodeURIComponent(invitation.rsvp.message)}`;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = 'Confirmar asistencia ↗';
  $('#rsvp-action').append(link);
} else {
  const note = document.createElement('span');
  note.className = 'unavailable';
  note.textContent = 'WhatsApp por configurar';
  $('#rsvp-action').append(note);
}

const countdownTarget = new Date(`${invitation.date}T00:00:00-06:00`).getTime();
function updateCountdown() {
  const now = Date.now();
  const remaining = Math.max(0, countdownTarget - now);
  const units = {
    days: Math.floor(remaining / 86400000),
    hours: Math.floor(remaining / 3600000) % 24,
    minutes: Math.floor(remaining / 60000) % 60,
    seconds: Math.floor(remaining / 1000) % 60,
  };
  for (const [key, value] of Object.entries(units)) $(`#${key}`).textContent = pad(value);
  if (remaining === 0) {
    $('#countdown-message').textContent = now < countdownTarget + 86400000
      ? '¡Hoy celebramos los XV años de Corina!'
      : 'Gracias por acompañarme en este día tan especial.';
  }
}
updateCountdown();
setInterval(updateCountdown, 1000);

const audio = $('#background-audio');
const musicToggle = $('#music-toggle');
if (invitation.music.src) {
  audio.src = invitation.music.src;
  musicToggle.hidden = false;
  musicToggle.addEventListener('click', async () => {
    if (audio.paused) {
      try { await audio.play(); } catch { musicToggle.title = 'No se pudo reproducir el audio'; }
    } else audio.pause();
  });
  audio.addEventListener('play', () => { musicToggle.classList.add('is-playing'); musicToggle.setAttribute('aria-label', 'Pausar música'); musicToggle.title = 'Pausar música'; });
  audio.addEventListener('pause', () => { musicToggle.classList.remove('is-playing'); musicToggle.setAttribute('aria-label', 'Reproducir música'); musicToggle.title = 'Reproducir música'; });
}

const opening = $('#opening');
const main = $('#invitation');
main.inert = true;
document.body.classList.add('no-scroll');
$('#open-button').addEventListener('click', () => {
  opening.classList.add('is-opening');
  if (invitation.music.src) audio.play().catch(() => undefined);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  setTimeout(() => {
    opening.classList.add('is-leaving');
    main.inert = false;
    document.body.classList.remove('no-scroll');
    window.scrollTo(0, 0);
    setTimeout(() => {
      opening.remove();
      $('#hero-title').setAttribute('tabindex', '-1');
      $('#hero-title').focus({ preventScroll: true });
    }, reduced ? 0 : 550);
  }, reduced ? 0 : 850);
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal, .timeline').forEach((element) => revealObserver.observe(element));

let currentImage = 0;
let previousFocus = null;
let touchStart = null;
const lightbox = $('#lightbox');
function showImage(index) {
  currentImage = (index + gallery.length) % gallery.length;
  $('#lightbox-image').src = gallery[currentImage].src;
  $('#lightbox-image').alt = gallery[currentImage].alt;
  $('#lightbox-caption').textContent = gallery[currentImage].alt;
  $('#lightbox-count').textContent = `${currentImage + 1} / ${gallery.length}`;
}
function openLightbox(index, trigger) {
  if (!gallery.length) return;
  previousFocus = trigger;
  showImage(index);
  lightbox.hidden = false;
  main.inert = true;
  document.body.classList.add('no-scroll');
  $('.lightbox-close').focus();
}
function closeLightbox() {
  lightbox.hidden = true;
  main.inert = false;
  document.body.classList.remove('no-scroll');
  previousFocus?.focus();
}
$('.lightbox-close').addEventListener('click', closeLightbox);
$('.lightbox-prev').addEventListener('click', () => showImage(currentImage - 1));
$('.lightbox-next').addEventListener('click', () => showImage(currentImage + 1));
lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
lightbox.addEventListener('touchstart', (event) => { touchStart = event.changedTouches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend', (event) => {
  if (touchStart === null) return;
  const distance = event.changedTouches[0].clientX - touchStart;
  if (Math.abs(distance) > 45) showImage(currentImage + (distance < 0 ? 1 : -1));
  touchStart = null;
}, { passive: true });
document.addEventListener('keydown', (event) => {
  if (lightbox.hidden) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') showImage(currentImage - 1);
  if (event.key === 'ArrowRight') showImage(currentImage + 1);
  if (event.key === 'Tab') {
    const controls = [...lightbox.querySelectorAll('button')];
    const next = event.shiftKey ? controls.at(-1) : controls[0];
    if (document.activeElement === (event.shiftKey ? controls[0] : controls.at(-1))) {
      event.preventDefault();
      next.focus();
    }
  }
});
