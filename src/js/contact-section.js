import {
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  PackageOpen,
  Phone,
  Truck,
  createElement,
} from 'lucide';
import footerBanner from '../assets/IMGS/cowboy-ranch.jpg';
import brandLogo from '../assets/Casa Loram Beige Longhorn Logo.png';
import { contactConfig, getWhatsAppUrl } from './contact-config.js';
import { footerConfig } from './footer-config.js';

const iconMap = { PackageOpen, MessageCircle, Truck };
const icon = (shape, className = '') => {
  const element = createElement(shape, { 'aria-hidden': 'true', focusable: 'false' });
  if (className) element.classList.add(className);
  return element.outerHTML;
};
const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));

const formatMexicanPhone = (number) => {
  const match = number.match(/^\+52(\d{3})(\d{3})(\d{4})$/);
  return match ? `+52 ${match[1]} ${match[2]} ${match[3]}` : number;
};

const renderContactItem = ({ shape, label, value, href, external = false }) => `
  <li class="site-footer__contact-item">
    ${icon(shape)}
    <div><span class="site-footer__item-label">${label}</span>
      ${href
        ? `<a href="${escapeHtml(href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${escapeHtml(value)}</a>`
        : `<span class="site-footer__pending">Por configurar</span>`}
    </div>
  </li>`;

export const initContactSection = () => {
  const mount = document.querySelector('[data-contact-section]');
  if (!mount) return;

  const contacts = [
    ...(contactConfig.phone ? [{ shape: Phone, label: 'Teléfono', value: formatMexicanPhone(contactConfig.phone), href: `tel:${contactConfig.phone.replace(/[^\d+]/g, '')}` }] : []),
    { shape: MessageCircle, label: 'WhatsApp', value: formatMexicanPhone(contactConfig.whatsapp), href: contactConfig.whatsapp ? getWhatsAppUrl(contactConfig.whatsappMessage) : '', external: true },
    ...(contactConfig.email ? [{ shape: Mail, label: 'Correo', value: contactConfig.email, href: `mailto:${contactConfig.email}` }] : []),
  ];

  const location = [contactConfig.city, contactConfig.state, contactConfig.postalCode].filter(Boolean).join(', ');
  const benefits = footerConfig.benefits.map((benefit) => `
    <li class="site-footer__benefit">
      ${icon(iconMap[benefit.icon])}
      <div><h3>${escapeHtml(benefit.title)}</h3><p>${escapeHtml(benefit.description)}</p></div>
    </li>`).join('');
  const socialLinks = [
    footerConfig.social.instagram
      ? `<a class="site-footer__social-name" href="${escapeHtml(footerConfig.social.instagram)}" target="_blank" rel="noopener noreferrer">Instagram</a>`
      : '<span class="site-footer__social-pending">Instagram · por configurar</span>',
    footerConfig.social.facebook
      ? `<a class="site-footer__social-name" href="${escapeHtml(footerConfig.social.facebook)}" target="_blank" rel="noopener noreferrer">Facebook</a>`
      : '<span class="site-footer__social-pending">Facebook · por configurar</span>',
    footerConfig.social.tiktok
      ? `<a class="site-footer__social-name" href="${escapeHtml(footerConfig.social.tiktok)}" target="_blank" rel="noopener noreferrer">TikTok</a>`
      : '<span class="site-footer__social-pending">TikTok · por configurar</span>',
    footerConfig.social.whatsapp && contactConfig.whatsapp
      ? `<a class="site-footer__social-link" href="${escapeHtml(getWhatsAppUrl(contactConfig.whatsappMessage))}" target="_blank" rel="noopener noreferrer" aria-label="Escribir a Casa Loram por WhatsApp">${icon(MessageCircle)}</a>`
      : '',
  ].join('');
  const institutionalLinks = footerConfig.institutionalLinks.map((link) => link.href
    ? `<a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a>`
    : `<span class="site-footer__legal-pending" aria-disabled="true">${escapeHtml(link.label)}<small>Por publicar</small></span>`).join('');

  mount.innerHTML = `
    <footer class="site-footer" id="pie-pagina">
      <section class="footer-editorial" aria-labelledby="footer-editorial-title">
        <img class="footer-editorial__image" src="${footerBanner}" alt="Vaquero a caballo en un paisaje abierto de rancho" width="4460" height="2977" loading="lazy" />
        <div class="footer-editorial__shade" aria-hidden="true"></div>
        <div class="footer-editorial__content">
          <p class="footer-editorial__eyebrow">CASA LORAM · WESTERN CONTEMPORÁNEO</p>
          <h2 id="footer-editorial-title">${escapeHtml(footerConfig.brand.closingLine)}</h2>
          <span class="footer-editorial__rule" aria-hidden="true"></span>
          <p class="footer-editorial__signature">Casa Loram</p>
        </div>
      </section>

      <div class="site-footer__body">
        <div class="site-footer__inner">
          <ul class="site-footer__benefits" aria-label="Lo que encontrarás en Casa Loram">${benefits}</ul>

          <div class="site-footer__columns">
            <section class="site-footer__brand" aria-label="Casa Loram">
              <a class="site-footer__brand-link" href="#inicio" aria-label="Casa Loram, volver al inicio">
                <img src="${brandLogo}" alt="Casa Loram — Tradición en cada paso" width="1774" height="887" loading="lazy" />
              </a>
              <p>${escapeHtml(footerConfig.brand.description)}</p>
              <div class="site-footer__socials" aria-label="Redes sociales">
                ${socialLinks}
              </div>
            </section>

            <section class="site-footer__group" aria-labelledby="footer-contact-title">
              <h2 id="footer-contact-title">Contáctanos</h2>
              <ul class="site-footer__contact-list">${contacts.map(renderContactItem).join('')}</ul>
            </section>

            <section class="site-footer__group" aria-labelledby="footer-location-title">
              <h2 id="footer-location-title">Visítanos</h2>
              <div class="site-footer__location">
                ${icon(MapPin)}
                <div><p>${escapeHtml(contactConfig.address || 'Dirección por configurar')}</p><p>${escapeHtml(location)}</p>
                  ${contactConfig.googleMapsUrl ? `<a href="${escapeHtml(contactConfig.googleMapsUrl)}" target="_blank" rel="noopener noreferrer">Cómo llegar ${icon(MapPin, 'site-footer__link-icon')}</a>` : ''}
                </div>
              </div>
            </section>

            <section class="site-footer__group" aria-labelledby="footer-hours-title">
              <h2 id="footer-hours-title">Horario</h2>
              <div class="site-footer__hours" id="horarios">
                ${icon(Clock3)}
                <div>${contactConfig.schedule.map((entry) => `<p><span>${escapeHtml(entry.days)}</span><span>${escapeHtml(entry.hours)}</span></p>`).join('')}</div>
              </div>
            </section>
          </div>

          <div class="site-footer__legal">
            <nav class="site-footer__legal-links" aria-label="Información institucional">${institutionalLinks}</nav>
            <span class="site-footer__made-in">Hecho en México</span>
            <p class="site-footer__copyright">© ${new Date().getFullYear()} Casa Loram. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </footer>`;
};
