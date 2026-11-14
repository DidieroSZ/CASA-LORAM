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
const WEEKDAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const getStoreTime = () => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: STORE_TIME_ZONE, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  const dayIndex = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(values.weekday);
  return { dayIndex, minutes: Number(values.hour) * 60 + Number(values.minute) };
};

const parseTime = (time) => {
  if (typeof time !== 'string' || !/^\d{2}:\d{2}$/.test(time)) return null;
  const [hours, minutes] = time.split(':').map(Number);
  return hours <= 23 && minutes <= 59 ? hours * 60 + minutes : null;
};

const getIntervals = (entry) => {
  const intervals = Array.isArray(entry) ? entry : [entry];
  return intervals.map((interval) => ({ open: parseTime(interval?.open), close: parseTime(interval?.close) }))
    .filter(({ open, close }) => open !== null && close !== null && close > open);
};

const formatTime = (minutes) => {
  const hours24 = Math.floor(minutes / 60);
  const suffix = hours24 < 12 ? 'AM' : 'PM';
  const hours12 = hours24 % 12 || 12;
  return `${hours12}:${String(minutes % 60).padStart(2, '0')} ${suffix}`;
};

const getCompactSchedule = () => {
  const days = [1, 2, 3, 4, 5, 6, 0];
  const groups = [];
  days.forEach((day) => {
    const hours = getIntervals(STORE_HOURS[day]).map(({ open, close }) => `${formatTime(open)}–${formatTime(close)}`).join(' / ');
    const previous = groups.at(-1);
    if (hours && previous?.hours === hours && previous.end === day - 1) {
      previous.end = day;
    } else if (hours) {
      groups.push({ start: day, end: day, hours });
    }
  });
  return groups.map(({ start, end, hours }) => {
    const dayLabel = start === end ? WEEKDAY_LABELS[start] : `${WEEKDAY_LABELS[start]}–${WEEKDAY_LABELS[end]}`;
    return `${dayLabel} · ${hours}`;
  }).join('　');
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

  schedule.textContent = getCompactSchedule() || 'Horario por confirmar';

  if (!status || !statusLabel) return;

  const updateStatus = () => {
    const { dayIndex, minutes: localMinutes } = getStoreTime();
    const todayIntervals = getIntervals(STORE_HOURS[dayIndex]);
    const previousDayIntervals = getIntervals(STORE_HOURS[(dayIndex + 6) % 7]);
    const isOpen = todayIntervals.some(({ open, close }) => localMinutes >= open && localMinutes < close)
      || previousDayIntervals.some(({ open, close }) => close < open && localMinutes < close);

    status.classList.toggle('is-open', isOpen);
    status.classList.toggle('is-closed', !isOpen);
    statusLabel.textContent = isOpen ? 'Abierto ahora' : 'Cerrado ahora';
  };

  updateStatus();
  window.setInterval(updateStatus, 60_000);
};
