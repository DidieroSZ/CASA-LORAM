import './styles/globalStyles.css';
import './styles/header.css';
import './styles/hero.css';
import './styles/catalog.css';
import './styles/footer.css';
import './styles/intro.css';
import './styles/productCatalog.css';
import './styles/contact.css';
import heroImage from './assets/casa-loram-hero.png';
import heroImage2 from './assets/IMGS/landscape.png';
import brandLogo from './assets/Casa Loram Beige Longhorn Logo.png';
import { createElement } from 'lucide';
import { ArrowDownRight, Clock3, MapPin, PackageOpen, MessageCircle } from 'lucide';
import { getWhatsAppUrl, contactConfig } from './js/contact-config.js';
import { initStoreStatus } from './js/store-hours.js';
import { initInteractions } from './js/interactions.js';
import { initAnimations } from './js/animations.js';
import { initSkinExplorer } from './js/skin-explorer.js';
import { initProductCatalog } from './js/productCatalog.js';
import { initContactSection } from './js/contact-section.js';
import { initConsultationSection } from './js/consultation-section.js';
import { initMeasurementEvents } from './js/measurement.js';

const icon = (node, className = '') => {
  const element = createElement(node, { 'aria-hidden': 'true', focusable: 'false' });
  if (className) element.classList.add(className);
  return element.outerHTML;
};

document.querySelector('#app').innerHTML = `
  <!-- Section header INICIA -->
  <header class="site-header">
    <a class="wordmark" href="#inicio" aria-label="Casa Loram, inicio">
      <img class="wordmark__logo" src="${brandLogo}" alt="Casa Loram — Tradición en cada paso" />
    </a>
    <nav class="primary-navigation" id="primary-navigation" aria-label="Navegación principal">
      <a href="#inicio" data-nav-link>Inicio</a>
      <a href="#catalogo" data-nav-link>Catálogo</a>
      <a href="#coleccion" data-nav-link>Pieles</a>
      <a href="#contacto" data-nav-link>Contacto</a>
      <a class="navigation-cta" href="${getWhatsAppUrl(contactConfig.whatsappMessage)}" target="_blank" rel="noopener noreferrer">Escríbenos ${icon(MessageCircle, 'navigation-cta__icon')}</a>
    </nav>
    <div class="header-hours" aria-label="Horarios de atención">
      ${icon(Clock3, 'header-hours__icon')}
      <div class="header-hours__content">
        <span class="header-hours__title">Horario</span>
        <div class="header-hours__schedule" data-header-hours aria-live="polite"></div>
      </div>
      <span class="header-hours__status is-closed" data-store-status role="status" aria-live="polite">
        <i aria-hidden="true"></i><span data-store-status-label>Consultando</span>
      </span>
    </div>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation" aria-label="Abrir menú">
      <span></span><span></span>
    </button>
  </header>
  <!-- Section header FIN -->

  <main>
    <!-- Section hero INICIA -->
    <section class="hero" id="inicio" aria-labelledby="hero-title">
      <div class="hero__image">
        <img src="${heroImage2}" alt="Botas western, sombrero y cinturón de piel en un taller de cuero" fetchpriority="high" />
      </div>
      <div class="hero__content">
        <p class="eyebrow"><span></span> Hecho para dejar huella</p>
        <h1 id="hero-title" tabindex="-1">Botas, texanas y estilo western <em>en cada paso.</em></h1>
        <p class="hero__description">Explora botas y botines de piel, texanas, sombreros, cinturones y accesorios western. Consulta modelos y tallas por WhatsApp o visítanos en León, Guanajuato.</p>
        <p class="hero__note">Calidad y estilo con esencia vaquera. Encuentra piezas que reflejan personalidad, tradición y autenticidad.</p>
        <div class="hero__actions">
          <a class="button button--primary" href="#catalogo">Explorar catálogo ${icon(ArrowDownRight, 'button__icon')}</a>
          <a class="button button--text" href="#contacto">Visítanos en tienda ${icon(MapPin, 'button__icon')}</a>
        </div>
        <div class="hero__details" aria-label="Información de la tienda">
          <a class="store-detail" href="#catalogo">
            ${icon(PackageOpen, 'store-detail__icon')}
            <span>Envíos a todo México<br />y Estados Unidos</span>
          </a>
          <a class="store-detail" href="#contacto">
            ${icon(MapPin, 'store-detail__icon')}
            <span>León, Guanajuato<br />México</span>
          </a>
        </div>
      </div>
      <a class="hero__scroll" href="#catalogo" aria-label="Desplazarse al catálogo"><span>DESCUBRE LA COLECCIÓN</span><i></i></a>
    </section>
    <!-- Section hero FIN -->

    <!-- Section coleccion INICIA -->
    <section class="skin-explorer" id="coleccion" aria-labelledby="collection-title">
      <div class="skin-explorer__intro">
        <div class="skin-explorer__intro-copy">
          <p class="eyebrow eyebrow--dark"><span></span> Materia y carácter</p>
          <h2 id="collection-title">El carácter<br /><em>de cada piel.</em></h2>
          <p>Cada piel tiene una textura, una personalidad y características propias. En Casa Loram reconocemos el valor de los materiales que dan identidad a cada pieza. Descubre sus particularidades y conoce cómo conservar su apariencia con los cuidados adecuados.</p>
        </div>
        <figure class="skin-editorial-visual" aria-label="Espacio reservado para fotografía editorial de texturas de pieles">
          <span>CASA LORAM · MATERIALES</span>
          <p>Texturas con<br /><em>carácter propio.</em></p>
          <small>Fotografía editorial por integrar</small>
        </figure>
      </div>
      <div class="skin-explorer__mount" data-skin-explorer></div>
      <aside class="skin-conservation" aria-labelledby="skin-conservation-title">
        <div class="skin-conservation__heading">
          <p class="eyebrow eyebrow--dark"><span></span> Conservación</p>
          <h3 id="skin-conservation-title">Cuida cada detalle,<br /><em>conserva su carácter.</em></h3>
        </div>
        <div class="skin-conservation__tips">
          <article><span>01</span><h4>Limpieza delicada</h4><p>Retira polvo y suciedad superficial utilizando herramientas suaves y productos adecuados para cada material.</p></article>
          <article><span>02</span><h4>Evita la humedad</h4><p>Procura mantener los artículos alejados del agua y permite que se sequen naturalmente cuando sea necesario.</p></article>
          <article><span>03</span><h4>Protección del material</h4><p>Evita la exposición prolongada al sol y a fuentes de calor que puedan alterar su apariencia.</p></article>
          <article><span>04</span><h4>Almacenamiento adecuado</h4><p>Guarda los productos en espacios secos y ventilados, evitando la compresión y el contacto con superficies abrasivas.</p></article>
        </div>
        <p class="skin-conservation__note">Los cuidados aquí descritos son orientativos. El tratamiento adecuado depende del tipo de piel, su proceso de curtido y el acabado del producto. Siempre deben prevalecer las indicaciones específicas del fabricante o proveedor.</p>
      </aside>
    </section>
    <!-- Section coleccion FIN -->

    <!-- Section catalogo INICIA -->
    <section class="product-catalog" id="catalogo" aria-labelledby="catalog-title">
      <div class="product-catalog__intro">
        <p class="eyebrow eyebrow--dark"><span></span> Selección Casa Loram</p>
        <h2 id="catalog-title">Encuentra tu <em>pieza.</em></h2>
        <p>Explora el catálogo por producto, material, color, precio o marca.</p>
      </div>
      <div class="product-catalog__filters" data-catalog-filters aria-label="Filtros del catálogo"></div>
      <div class="product-catalog__results-heading">
        <h3>Catálogo</h3>
        <div class="product-catalog__result-actions">
          <p data-catalog-result-count>0 productos</p>
          <button type="button" data-clear-catalog-filters disabled>Limpiar filtros</button>
        </div>
      </div>
      <div class="product-catalog__results" data-catalog-results aria-live="polite"></div>
    </section>
    <!-- Section catalogo FIN -->

  </main>
  <!-- Section contacto INICIA -->
  <section class="contact-section" id="contacto" data-consultation-section aria-labelledby="contact-title">
    <div class="contact-section__card"></div>
  </section>
  <!-- Section contacto FIN -->
  <!-- Section footer INICIA -->
  <div data-contact-section></div>
  <!-- Section footer FIN -->
  <dialog class="product-dialog" data-product-dialog aria-labelledby="product-detail-title" aria-modal="true">
    <div class="product-dialog__surface" data-product-surface>
      <button class="product-dialog__close" type="button" data-close-product aria-label="Cerrar detalle">Cerrar</button>
      <div data-product-detail></div>
    </div>
  </dialog>
`;

initStoreStatus();
initInteractions();
initSkinExplorer();
initProductCatalog();
initContactSection();
initConsultationSection();
initMeasurementEvents();
initAnimations();
