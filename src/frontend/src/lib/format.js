import { API_ORIGIN } from './api';

const currencyFormatter = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

const dateTimeFormatter = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

// Compact form for tables and lists (admin): "3 oct. 2026, 20:00".
const shortDateTimeFormatter = new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const IMAGE_BASE_URL = `${API_ORIGIN}/images/experiences/`;

const HOUR_MS = 60 * 60 * 1000;

export function formatPrice(value) {
  return currencyFormatter.format(Number(value));
}

export function formatDateTime(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : dateTimeFormatter.format(date);
}

export function formatDateTimeShort(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : shortDateTimeFormatter.format(date);
}

export function formatTimeUntil(ms) {
  const totalHours = Math.floor(ms / HOUR_MS);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  if (days > 0) {
    return `Dans ${days} j ${hours} h`;
  }
  if (totalHours > 0) {
    return `Dans ${hours} h`;
  }
  return "Dans moins d'une heure";
}

export function experienceImageUrl(image) {
  return image ? `${IMAGE_BASE_URL}${image}` : null;
}
