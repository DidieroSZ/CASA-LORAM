import { Clock3, MapPin, MessageCircle, Phone, Send, createElement } from 'lucide';
import { contactConfig, getWhatsAppUrl } from './contact-config.js';
import { footerConfig } from './footer-config.js';
import { trackEvent } from './measurement.js';

const icon = (shape) => createElement(shape, { 'aria-hidden': 'true', focusable: 'false' }).outerHTML;
const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));

export const initConsultationSection = () => {
  const mount = document.querySelector('[data-consultation-section] .contact-section__card');
  if (!mount) return;

  const address = [contactConfig.address, contactConfig.city, contactConfig.state, contactConfig.postalCode].filter(Boolean).join(', ');
  mount.innerHTML = `
    <div class="contact-section__intro">
      <p class="eyebrow eyebrow--dark"><span></span> Atención Casa Loram</p>
      <h2 id="contact-title">Hablemos de tu próxima <em>pieza.</em></h2>
      <p>Escríbenos para consultar disponibilidad, tallas y detalles de nuestra selección. Te atenderemos por WhatsApp.</p>
      <div class="contact-section__details">
        <a class="contact-section__detail" href="tel:${escapeHtml(contactConfig.phone)}">${icon(Phone)}<span><small>Línea directa</small>${escapeHtml(contactConfig.phone)}</span></a>
        <a class="contact-section__detail" href="${escapeHtml(getWhatsAppUrl(contactConfig.whatsappMessage))}" target="_blank" rel="noopener noreferrer">${icon(MessageCircle)}<span><small>WhatsApp</small>Consultar por mensaje</span></a>
        <div class="contact-section__detail">${icon(MapPin)}<span><small>Showroom</small>${escapeHtml(address)}</span></div>
      </div>
      <div class="contact-section__schedule">${icon(Clock3)}<span><small>Horario de atención</small>${contactConfig.schedule.map(({ days, hours }) => `<span>${escapeHtml(days)} · ${escapeHtml(hours)}</span>`).join('')}</span></div>
      <nav class="contact-section__socials" aria-label="Redes sociales de Casa Loram">
        <a href="${escapeHtml(footerConfig.social.instagram)}" target="_blank" rel="noopener noreferrer">Instagram</a>
        <a href="${escapeHtml(footerConfig.social.facebook)}" target="_blank" rel="noopener noreferrer">Facebook</a>
        <a href="${escapeHtml(footerConfig.social.tiktok)}" target="_blank" rel="noopener noreferrer">TikTok</a>
      </nav>
    </div>
    <div class="contact-section__form-wrap">
      <h3>Solicitud de consulta</h3>
      <p>Cuéntanos qué estás buscando y prepararemos tu mensaje para WhatsApp.</p>
      <form class="contact-form" data-contact-form>
        <label>Nombre completo<input name="name" autocomplete="name" placeholder="Tu nombre" required /></label>
        <label>Teléfono / WhatsApp<input name="phone" type="tel" autocomplete="tel" placeholder="+52 ..." required /></label>
        <label class="contact-form__wide">Pieza o colección de interés
          <select name="interest" required><option value="" disabled selected>Selecciona una opción</option><option>Botas</option><option>Botines</option><option>Texanas</option><option>Sombreros</option><option>Cinturones y accesorios</option><option>Otra consulta</option></select>
        </label>
        <label class="contact-form__wide">Mensaje<textarea name="message" rows="4" placeholder="Talla, color, modelo o cualquier detalle que nos ayude" required></textarea></label>
        <button class="contact-form__submit" type="submit">${icon(Send)} Enviar solicitud por WhatsApp</button>
        <p class="contact-form__note">Al enviar, se abrirá WhatsApp con los datos de tu consulta para que puedas revisarlos antes de compartirlos.</p>
      </form>
    </div>
    <div class="contact-section__map">
      <div><p class="eyebrow eyebrow--dark"><span></span> Encuéntranos</p><h3>Visita nuestro showroom</h3><p>${escapeHtml(address)}</p><a href="${escapeHtml(contactConfig.googleMapsUrl)}" target="_blank" rel="noopener noreferrer">Cómo llegar ${icon(MapPin)}</a></div>
      <iframe title="Mapa de ubicación de Casa Loram en León, Guanajuato" src="${escapeHtml(contactConfig.googleMapsEmbedUrl)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
    </div>`;

  mount.querySelector('[data-contact-form]').addEventListener('submit', (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const data = new FormData(event.currentTarget);
    const message = `Hola, Casa Loram. Soy ${data.get('name')} (${data.get('phone')}). Me interesa: ${data.get('interest')}. ${data.get('message')}`;
    trackEvent('generate_lead', { form_name: 'contact_consultation', lead_method: 'whatsapp', product_category: data.get('interest') });
    window.open(getWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
  });
};
