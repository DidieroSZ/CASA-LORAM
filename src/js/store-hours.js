// Horarios confirmados por Casa Loram.
const STORE_HOURS_CONFIRMED = true;
const STORE_TIME_ZONE = 'America/Mexico_City';
const STORE_HOURS = {
  0: { open: '09:00', close: '18:00' },
  1: { open: '09:00', close: '19:00' },
  2: { open: '09:00', close: '19:00' },
  3: { open: '09:00', close: '19:00' },
  4: { open: '09:00', close: '19:00' },
  5: { open: '09:00', close: '19:00' },
  6: { open: '09:00', close: '19:00' },
};

export const initStoreStatus = () => {
  const schedule = document.querySelector('[data-header-hours]');
  const status = document.querySelector('[data-store-status]');
  const statusLabel = document.querySelector('[data-store-status-label]');
  if (!schedule) return;

  if (!STORE_HOURS_CONFIRMED) {
    schedule.textContent = 'Horario por confirmar';
    if (status && statusLabel) {
      status.classList.remove('is-open', 'is-closed');
      status.classList.add('is-unknown');
      statusLabel.textContent = 'Horario por confirmar';
    }
    return;
  }

  schedule.innerHTML = [
    `<span>Lun–Sáb · ${STORE_HOURS[1].open}–${STORE_HOURS[1].close} h</span>`,
    `<span>Dom · ${STORE_HOURS[0].open}–${STORE_HOURS[0].close} h</span>`,
  ].join('');

  if (!status || !statusLabel) return;

  const updateStatus = () => {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: STORE_TIME_ZONE,
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(new Date());
    const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
    const dayIndex = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(values.weekday);
    const localMinutes = Number(values.hour) * 60 + Number(values.minute);
    const scheduleForToday = STORE_HOURS[dayIndex];
    const [openHour, openMinute] = scheduleForToday.open.split(':').map(Number);
    const [closeHour, closeMinute] = scheduleForToday.close.split(':').map(Number);
    const opensAt = openHour * 60 + openMinute;
    const closesAt = closeHour * 60 + closeMinute;
    const isOpen = localMinutes >= opensAt && localMinutes < closesAt;

    status.classList.toggle('is-open', isOpen);
    status.classList.toggle('is-closed', !isOpen);
    statusLabel.textContent = isOpen ? 'Abierta' : 'Cerrada';
  };

  updateStatus();
  window.setInterval(updateStatus, 60_000);
};
