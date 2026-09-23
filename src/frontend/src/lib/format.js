import { API_ORIGIN } from './api';

const currencyFormatter = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

const IMAGE_BASE_URL = `${API_ORIGIN}/images/experiences/`;

export function formatPrice(value) {
  return currencyFormatter.format(Number(value));
}

export function experienceImageUrl(image) {
  return image ? `${IMAGE_BASE_URL}${image}` : null;
}
