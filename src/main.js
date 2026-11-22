const menu = document.querySelector('#service-menu');
document.querySelectorAll('[data-open-menu]').forEach(button => {
  button.addEventListener('click', () => menu.showModal());
});
menu.querySelector('.close-button').addEventListener('click', () => menu.close());
menu.addEventListener('click', event => {
  if (event.target !== menu) return;
  const bounds = menu.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) menu.close();
});
document.querySelector('#year').textContent = new Date().getFullYear();
// Do not leave a dated holiday notice on the site after the holiday.
const localDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
if (localDate > '2026-11-26') document.querySelector('#holiday-note').textContent = 'Holiday hours may vary. Please call before your visit.';
