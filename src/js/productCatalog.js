import productData from '../data/products.json';
import skinData from '../data/skins.json';
import { createBlendy } from 'blendy';
import { getWhatsAppUrl } from './contact-config.js';
import bootsImage from '../assets/catalog-thumbnails/boots.jpg';
import ankleBootImage from '../assets/catalog-thumbnails/ankle-boots.jpg';
import hatImage from '../assets/catalog-thumbnails/hats.jpg';
import texanaImage from '../assets/catalog-thumbnails/texanas.jpg';
import beltImage from '../assets/catalog-thumbnails/belts.jpg';
import bota01Image from '../assets/PRODUCTOS/bota_01.png';
import bota02Image from '../assets/PRODUCTOS/bota_02.png';
import bota03Image from '../assets/PRODUCTOS/bota_03.png';
import bota04Image from '../assets/PRODUCTOS/bota_04.png';
import bota05Image from '../assets/PRODUCTOS/bota_05.png';
import botin01Image from '../assets/PRODUCTOS/botin_01.png';
import botin02Image from '../assets/PRODUCTOS/botin_02.png';
import botin03Image from '../assets/PRODUCTOS/botin_03.png';
import botin04Image from '../assets/PRODUCTOS/botin_04.png';
import botin05Image from '../assets/PRODUCTOS/botin_05.png';
import cinturon01Image from '../assets/PRODUCTOS/cinturon_01.png';
import cinturon02Image from '../assets/PRODUCTOS/cinturon_02.png';
import cinturon03Image from '../assets/PRODUCTOS/cinturon_03.png';
import bootDisplay9Image from '../assets/PRODUCTOS/Embroidered Leather Cowboy Boot-9.png';
import bootDisplay3Image from '../assets/PRODUCTOS/Rustic Embroidered Cowboy Boot Display-3.png';
import bootDisplay7Image from '../assets/PRODUCTOS/Rustic Southwestern Cowboy Boot Display-7.png';
import bootDisplay2Image from '../assets/PRODUCTOS/Rustic Western Cowboy Boot Display-2.png';
import bootDisplay4Image from '../assets/PRODUCTOS/Rustic Western Cowboy Boot Display-4.png';
import sombrero01Image from '../assets/PRODUCTOS/sombrero_01.png';
import texana01Image from '../assets/PRODUCTOS/texana_01.png';

const PRODUCT_TYPES = [
  { id: 'sombreros', name: 'Sombreros', image: hatImage },
  { id: 'texanas', name: 'Texanas', image: texanaImage },
  { id: 'botas', name: 'Botas', image: bootsImage },
  { id: 'botines', name: 'Botines', image: ankleBootImage },
  { id: 'cinturones', name: 'Cinturones', image: beltImage },
];
const PRODUCT_IMAGES = {
  botas: bootsImage,
  botines: ankleBootImage,
  sombreros: hatImage,
  texanas: texanaImage,
  cinturones: beltImage,
  'bota_01.png': bota01Image,
  'bota_02.png': bota02Image,
  'bota_03.png': bota03Image,
  'bota_04.png': bota04Image,
  'bota_05.png': bota05Image,
  'botin_01.png': botin01Image,
  'botin_02.png': botin02Image,
  'botin_03.png': botin03Image,
  'botin_04.png': botin04Image,
  'botin_05.png': botin05Image,
  'cinturon_01.png': cinturon01Image,
  'cinturon_02.png': cinturon02Image,
  'cinturon_03.png': cinturon03Image,
  'Embroidered Leather Cowboy Boot-9.png': bootDisplay9Image,
  'Rustic Embroidered Cowboy Boot Display-3.png': bootDisplay3Image,
  'Rustic Southwestern Cowboy Boot Display-7.png': bootDisplay7Image,
  'Rustic Western Cowboy Boot Display-2.png': bootDisplay2Image,
  'Rustic Western Cowboy Boot Display-4.png': bootDisplay4Image,
  'sombrero_01.png': sombrero01Image,
  'texana_01.png': texana01Image,
};
const getProductImages = (product) => product.images?.length
  ? product.images.map((image) => ({ ...image, src: PRODUCT_IMAGES[image.imageKey] ?? image.src }))
  : (product.imageKey || product.imageSrc
    ? [{ src: PRODUCT_IMAGES[product.imageKey] ?? product.imageSrc, alt: product.imageAlt ?? product.name }]
    : []);

const KNOWN_BRANDS = [
  'Malcreado', 'Correcaminos', 'Ariat', 'Almeida',
  'Tombstone', 'Morcón', 'Indomables', 'Zargon',
];

const products = productData.products.filter((product) => product.active !== false);
const money = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}[character]));

const normalize = (value = '') => String(value).trim().toLocaleLowerCase('es-MX');
const getBrandId = (brand) => normalize(brand);

const getSkinOptions = () => skinData.skins
  .filter((skin) => skin.active && products.some((product) => product.skinId === skin.id))
  .map((skin) => ({ id: skin.id, name: skin.name }));

const getColorOptions = () => {
  const colors = new Map();
  products.forEach((product) => {
    const colorId = product.colorId;
    const colorName = product.colorName;
    if (colorId && colorName && !colors.has(colorId)) {
      colors.set(colorId, {
        id: colorId,
        name: colorName,
        hex: /^#[\da-f]{6}$/i.test(product.colorHex ?? '') ? product.colorHex : null,
      });
    }
  });
  return [...colors.values()];
};

const getPriceBounds = () => {
  const prices = products.map((product) => product.price).filter((price) => Number.isFinite(price) && price >= 0);
  return prices.length ? { min: Math.min(...prices), max: Math.max(...prices) } : null;
};

const isPriceActive = (state, bounds) => Boolean(
  bounds && (state.minPrice > bounds.min || state.maxPrice < bounds.max),
);

const hasActiveFilters = (state, bounds) => Boolean(
  state.typeId || state.skins.size || state.colors.size || state.brands.size || isPriceActive(state, bounds),
);

const matchesProduct = (product, state, bounds) => {
  if (state.typeId && product.typeId !== state.typeId) return false;
  if (state.skins.size && !state.skins.has(product.skinId)) return false;
  if (state.colors.size && !state.colors.has(product.colorId)) return false;
  if (state.brands.size && !state.brands.has(getBrandId(product.brand))) return false;
  if (isPriceActive(state, bounds) && (
    !Number.isFinite(product.price) || product.price < state.minPrice || product.price > state.maxPrice
  )) return false;
  return true;
};

const renderTypeFilter = (state) => `
  <details class="catalog-filter catalog-filter--types" open>
    <summary>Tipo de producto</summary>
    <div class="catalog-type-grid" role="group" aria-label="Tipo de producto">
      ${PRODUCT_TYPES.map((type) => {
        const available = products.some((product) => product.typeId === type.id);
        return `<button class="catalog-type${state.typeId === type.id ? ' is-selected' : ''}" type="button" data-filter-type="${type.id}" aria-pressed="${state.typeId === type.id}" ${available ? '' : 'disabled'}>
          <img src="${type.image}" alt="" aria-hidden="true" loading="lazy" />
          <span>${type.name}</span>
        </button>`;
      }).join('')}
    </div>
  </details>`;

const renderChoiceGroup = ({ title, className, options, stateValues, attribute, emptyText, colorSwatches = false }) => `
  <details class="catalog-filter ${className}" open>
    <summary>${title}</summary>
    ${options.length
      ? `<div class="catalog-chip-list" role="group" aria-label="${title}">
          ${options.map((option) => {
            const selected = stateValues.has(option.id);
            const available = products.some((product) => {
              if (attribute === 'skin') return product.skinId === option.id;
              if (attribute === 'color') return product.colorId === option.id;
              return getBrandId(product.brand) === option.id;
            });
            return `<button class="catalog-chip${selected ? ' is-selected' : ''}" type="button" data-filter-${attribute}="${escapeHtml(option.id)}" aria-pressed="${selected}" ${available ? '' : 'disabled'}>
              ${colorSwatches ? `<i aria-hidden="true" class="catalog-swatch"${option.hex ? ` style="--catalog-swatch:${option.hex}"` : ''}></i>` : ''}
              <span>${escapeHtml(option.name)}</span>
            </button>`;
          }).join('')}
        </div>`
      : `<p class="catalog-filter__empty">${emptyText}</p>`}
  </details>`;

const renderPriceFilter = (bounds, state) => {
  const hasPrices = Boolean(bounds);
  const min = bounds?.min ?? 0;
  const max = bounds?.max ?? 0;
  const inputMax = Math.max(max, min + 1);
  return `
    <details class="catalog-filter catalog-filter--price" open>
      <summary>Precio</summary>
      <div class="catalog-price-control">
        <label><span>Desde</span><output data-price-output="min">${hasPrices ? money.format(state.minPrice) : '—'}</output>
          <input type="range" data-price-min min="${min}" max="${inputMax}" value="${state.minPrice}" aria-label="Precio mínimo" ${hasPrices ? '' : 'disabled'} />
        </label>
        <label><span>Hasta</span><output data-price-output="max">${hasPrices ? money.format(state.maxPrice) : '—'}</output>
          <input type="range" data-price-max min="${min}" max="${inputMax}" value="${state.maxPrice}" aria-label="Precio máximo" ${hasPrices ? '' : 'disabled'} />
        </label>
      </div>
      ${hasPrices ? '' : '<p class="catalog-filter__empty">Se habilitará al cargar precios.</p>'}
    </details>`;
};

const renderFilters = (mount, state, bounds) => {
  mount.innerHTML = `
    ${renderTypeFilter(state)}
    ${renderChoiceGroup({
      title: 'Pieles',
      className: 'catalog-filter--skins',
      options: getSkinOptions(),
      stateValues: state.skins,
      attribute: 'skin',
      emptyText: 'Sin pieles asociadas a productos.',
    })}
    ${renderChoiceGroup({
      title: 'Color',
      className: 'catalog-filter--colors',
      options: getColorOptions(),
      stateValues: state.colors,
      attribute: 'color',
      emptyText: 'Sin colores registrados en productos.',
      colorSwatches: true,
    })}
    ${renderPriceFilter(bounds, state)}
    ${renderChoiceGroup({
      title: 'Marca',
      className: 'catalog-filter--brands',
      options: KNOWN_BRANDS.map((name) => ({ id: getBrandId(name), name })),
      stateValues: state.brands,
      attribute: 'brand',
      emptyText: 'Sin marcas registradas.',
    })}`;
};

const renderProductCard = (product) => {
  const type = PRODUCT_TYPES.find((entry) => entry.id === product.typeId);
  const image = getProductImages(product)[0];
  return `<article class="catalog-product-card">
    <button class="catalog-product-card__open" type="button" data-open-product="${escapeHtml(product.id)}" aria-label="Ver detalles de ${escapeHtml(product.name)}"><span class="catalog-product-card__content">
      <span class="catalog-product-card__media">${image
        ? `<img class="catalog-product-card__image" src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt ?? '')}" loading="lazy" />`
        : '<span class="catalog-product-card__image catalog-product-card__image--empty" aria-hidden="true"></span>'}</span>
    <span class="catalog-product-card__details">
      ${type ? `<p>${type.name}</p>` : ''}
      <h4>${escapeHtml(product.name)}</h4>
      <small class="catalog-product-card__sample">Ejemplo de catálogo · datos de muestra</small>
      ${product.brand ? `<span>${escapeHtml(product.brand)}</span>` : ''}
      ${Number.isFinite(product.price) ? `<strong>${money.format(product.price)}</strong>` : ''}
    </span></span></button>
  </article>`;
};

const PRODUCT_CARE = {};
const formatPrice = (price) => Number.isFinite(price) ? `${money.format(price)} MXN` : 'Consultar precio';
const renderProductDetail = (product) => {
  const type = PRODUCT_TYPES.find((entry) => entry.id === product.typeId);
  const images = getProductImages(product);
  const material = product.material ?? product.skinName ?? product.skinId;
  const variants = product.variants ?? [];
  const specifications = [
    ['Material', material], ['Piel', product.skinName], ['Horma', product.last], ['Estilo', product.style],
    ['Calidad', product.quality], ['Color', product.colorName],
    ['Tallas disponibles', Array.isArray(product.sizes) ? product.sizes.join(', ') : product.sizes],
  ].filter(([, value]) => value && String(value).trim());
  const careText = PRODUCT_CARE[product.careKey ?? material?.toLocaleLowerCase('es-MX')]
    ?? (material ? 'Consulta con nuestro equipo para conocer los cuidados recomendados.' : 'Consulta con nuestro equipo para conocer los cuidados recomendados.');
  const fields = [
    ['Producto', product.name], ['Marca', product.brand], ['SKU', product.sku], ['Precio', Number.isFinite(product.price) ? formatPrice(product.price) : null],
  ].filter(([, value]) => value);
  const message = [
    'Hola, me gustaría solicitar más información sobre este producto de Casa Loram.',
    `Producto: ${product.name}`,
    product.brand && `Marca: ${product.brand}`,
    product.sku && `SKU: ${product.sku}`,
    Number.isFinite(product.price) && `Precio: ${formatPrice(product.price)}`,
    variants.length && `Variante: ${variants[0].name ?? variants[0].value}`,
    '', 'Me gustaría conocer más detalles sobre sus características y disponibilidad.', '¡Gracias!',
  ].filter(Boolean).join('\n');
  const whatsappUrl = getWhatsAppUrl(message);
  return `<div class="product-detail">
    <div class="product-detail__gallery">
      ${images.length ? `<div class="product-detail__media"><img class="product-detail__image" src="${escapeHtml(images[0].src)}" alt="${escapeHtml(images[0].alt ?? product.name)}"></div>${images.length > 1 ? `<div class="product-detail__thumbnails">${images.map((image, index) => `<button type="button" data-detail-image="${index}" aria-label="Ver fotografía ${index + 1}" aria-pressed="${index === 0}"><img src="${escapeHtml(image.src)}" alt=""></button>`).join('')}</div>` : ''}` : '<div class="product-detail__media product-detail__image--empty" aria-label="Fotografía no disponible"></div>'}
    </div>
    <div class="product-detail__content">
      <p class="product-detail__sample">Ejemplo de catálogo · datos de muestra</p>
      <p class="product-detail__brand">${escapeHtml(product.brand ?? type?.name ?? 'Casa Loram')}</p>
      <h2 id="product-detail-title">${escapeHtml(product.name)}</h2>
      ${product.sku ? `<p class="product-detail__sku">SKU: ${escapeHtml(product.sku)}</p>` : ''}
      <p class="product-detail__price">${formatPrice(product.price)}</p>
      ${product.description ? `<p class="product-detail__description">${escapeHtml(product.description)}</p>` : ''}
      ${variants.length ? `<fieldset class="product-detail__variants"><legend>Variantes disponibles</legend><div>${variants.map((variant, index) => `<label><input type="radio" name="product-variant" value="${index}" ${index === 0 ? 'checked' : ''}><span>${escapeHtml(variant.name ?? variant.value ?? variant.color ?? variant.size ?? '')}</span></label>`).join('')}</div></fieldset>` : ''}
      ${specifications.length ? `<section class="product-detail__specs"><h3>Características</h3><dl>${specifications.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(Array.isArray(value) ? value.join(', ') : value)}</dd></div>`).join('')}</dl></section>` : ''}
      ${material ? `<section class="product-detail__care"><h3>Cuidados y conservación</h3><p>${escapeHtml(careText)}</p></section>` : ''}
      <a class="product-detail__whatsapp" href="${whatsappUrl}" target="_blank" rel="noopener noreferrer">Solicitar información por WhatsApp</a>
    </div>
  </div>`;
};

const renderResults = (mount, matchingProducts, hasCatalog, hasFilters) => {
  if (matchingProducts.length) {
    mount.innerHTML = `<div class="catalog-product-grid">${matchingProducts.map(renderProductCard).join('')}</div>`;
    return;
  }

  mount.innerHTML = `<div class="catalog-results-empty" role="status">
    <span class="catalog-results-empty__index">CASA LORAM · CATÁLOGO</span>
    <h4>${hasCatalog && hasFilters ? 'No encontramos piezas con esta selección.' : 'El catálogo de productos está en preparación.'}</h4>
    <p>${hasCatalog && hasFilters ? 'Prueba quitar algún filtro para ampliar los resultados.' : 'Los filtros se activarán conforme se registren productos y sus características.'}</p>
  </div>`;
};

const state = {
  typeId: null,
  skins: new Set(),
  colors: new Set(),
  brands: new Set(),
  minPrice: 0,
  maxPrice: 0,
};

let bounds = null;

export const initProductCatalog = () => {
  const filtersMount = document.querySelector('[data-catalog-filters]');
  const resultsMount = document.querySelector('[data-catalog-results]');
  const resultCount = document.querySelector('[data-catalog-result-count]');
  const clearButton = document.querySelector('[data-clear-catalog-filters]');
  const detailDialog = document.querySelector('[data-product-dialog]');
  const detailMount = detailDialog?.querySelector('[data-product-detail]');
  const detailSurface = detailDialog?.querySelector('[data-product-surface]');
  let activeProduct = null;
  let activeTrigger = null;
  let activeBlendId = null;
  let transitionState = 'closed';
  let closeRequested = false;
  let transitionSource = null;
  let blendy = null;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!filtersMount || !resultsMount || !resultCount || !clearButton) return;

  bounds = getPriceBounds();
  if (bounds) {
    state.minPrice = bounds.min;
    state.maxPrice = bounds.max;
  }

  renderFilters(filtersMount, state, bounds);

  const focusCloseButton = () => detailDialog.querySelector('[data-close-product]')?.focus();
  const removeTransitionSource = () => {
    if (!transitionSource) return;
    transitionSource.removeAttribute('data-blendy-from');
    transitionSource.remove();
    transitionSource = null;
  };

  const finishOpen = () => {
    transitionState = 'open';
    detailDialog.classList.remove('is-opening');
    detailDialog.classList.add('is-open');
    if (closeRequested) closeDetail();
  };

  const openDetail = (trigger, product) => {
    if (transitionState !== 'closed') return;
    transitionState = 'opening';
    closeRequested = false;
    activeProduct = product;
    activeTrigger = trigger;
    activeBlendId = `product-${String(product.id)}`;
    detailMount.innerHTML = renderProductDetail(product);
    const targetMedia = detailMount.querySelector('.product-detail__media');
    const sourceMedia = trigger.querySelector('.catalog-product-card__media');
    detailDialog.classList.remove('is-open', 'is-closing');
    detailDialog.classList.add('is-opening');
    targetMedia?.setAttribute('data-blendy-to', activeBlendId);

    if (targetMedia?.firstElementChild && sourceMedia?.firstElementChild && !reducedMotion.matches && blendy) {
      const bounds = sourceMedia.getBoundingClientRect();
      transitionSource = sourceMedia.cloneNode(true);
      transitionSource.setAttribute('data-blendy-from', activeBlendId);
      transitionSource.setAttribute('aria-hidden', 'true');
      transitionSource.querySelector('img')?.setAttribute('alt', '');
      Object.assign(transitionSource.style, {
        position: 'fixed',
        inset: 'auto',
        top: `${bounds.top}px`,
        left: `${bounds.left}px`,
        width: `${bounds.width}px`,
        height: `${bounds.height}px`,
        margin: '0',
        zIndex: '1000',
        pointerEvents: 'none',
      });
      detailSurface.append(transitionSource);
    }

    detailDialog.showModal();
    focusCloseButton();

    if (transitionSource) {
      const image = targetMedia.querySelector('img');
      const animate = () => {
        if (transitionState !== 'opening') return;
        blendy.update();
        blendy.toggle(activeBlendId, finishOpen);
      };
      const skipTransition = () => {
        removeTransitionSource();
        targetMedia?.removeAttribute('data-blendy-to');
        finishOpen();
      };
      if (image?.complete && image.naturalWidth > 0) animate();
      else if (image?.decode) image.decode().then(animate, skipTransition);
      else skipTransition();
    } else {
      finishOpen();
    }
  };

  resultsMount.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-open-product]');
    if (!trigger || !detailDialog || !detailMount || transitionState !== 'closed') return;
    const product = products.find((entry) => String(entry.id) === trigger.dataset.openProduct);
    if (!product) return;
    openDetail(trigger, product);
  });
  const closeDetail = () => {
    if (!detailDialog?.open || transitionState === 'closed' || transitionState === 'closing') return;
    if (transitionState === 'opening') {
      closeRequested = true;
      return;
    }
    transitionState = 'closing';
    detailDialog.classList.remove('is-open');
    detailDialog.classList.add('is-closing');
    const finishClose = () => {
      detailDialog.close();
      detailDialog.classList.remove('is-opening', 'is-open', 'is-closing');
      transitionState = 'closed';
      removeTransitionSource();
      if (activeTrigger?.isConnected) activeTrigger.focus();
      activeTrigger = null;
      activeProduct = null;
      activeBlendId = null;
    };
    if (reducedMotion.matches || !blendy || !activeBlendId || !transitionSource) finishClose();
    else blendy.untoggle(activeBlendId, finishClose);
  };
  detailDialog?.addEventListener('click', (event) => {
    if (event.target === detailDialog || event.target.closest('[data-close-product]')) closeDetail();
    if (transitionState !== 'open') return;
    const thumb = event.target.closest('[data-detail-image]');
    if (!thumb || !detailMount) return;
    const product = activeProduct;
    const images = product ? getProductImages(product) : [];
    const image = images[Number(thumb.dataset.detailImage)];
    if (!image) return;
    const mainImage = detailMount.querySelector('.product-detail__image');
    if (mainImage) { mainImage.src = image.src; mainImage.alt = image.alt ?? product.name; }
    detailMount.querySelectorAll('[data-detail-image]').forEach((button) => button.setAttribute('aria-pressed', String(button === thumb)));
  });
  detailDialog?.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeDetail();
  });
  detailDialog?.addEventListener('close', () => {
    if (transitionState !== 'closed') {
      transitionState = 'closed';
      detailDialog.classList.remove('is-opening', 'is-open', 'is-closing');
      removeTransitionSource();
      activeProduct = null;
      activeTrigger = null;
      activeBlendId = null;
    }
  });
  detailMount?.addEventListener('change', (event) => {
    const input = event.target.closest('[name="product-variant"]');
    if (!input || !activeProduct) return;
    const variant = activeProduct.variants?.[Number(input.value)];
    const link = detailMount.querySelector('.product-detail__whatsapp');
    if (!variant || !link) return;
    const message = [
      'Hola, me gustaría solicitar más información sobre este producto de Casa Loram.',
      `Producto: ${activeProduct.name}`,
      activeProduct.brand && `Marca: ${activeProduct.brand}`,
      activeProduct.sku && `SKU: ${activeProduct.sku}`,
      Number.isFinite(activeProduct.price) && `Precio: ${formatPrice(activeProduct.price)}`,
      `Variante: ${variant.name ?? variant.value ?? variant.color ?? variant.size}`,
      '', 'Me gustaría conocer más detalles sobre sus características y disponibilidad.', '¡Gracias!',
    ].filter(Boolean).join('\n');
    link.href = getWhatsAppUrl(message);
  });

  const update = () => {
    const matchingProducts = products.filter((product) => matchesProduct(product, state, bounds));
    resultCount.textContent = products.length
      ? `${matchingProducts.length} ${matchingProducts.length === 1 ? 'producto' : 'productos'}`
      : 'Catálogo sin productos';
    clearButton.disabled = !hasActiveFilters(state, bounds);
    filtersMount.querySelectorAll('[data-filter-type]').forEach((button) => {
      const selected = state.typeId === button.dataset.filterType;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    filtersMount.querySelectorAll('[data-filter-skin], [data-filter-color], [data-filter-brand]').forEach((button) => {
      const selected = button.hasAttribute('data-filter-skin')
        ? state.skins.has(button.dataset.filterSkin)
        : button.hasAttribute('data-filter-color')
          ? state.colors.has(button.dataset.filterColor)
          : state.brands.has(button.dataset.filterBrand);
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    const minInput = filtersMount.querySelector('[data-price-min]');
    const maxInput = filtersMount.querySelector('[data-price-max]');
    if (minInput) minInput.value = String(state.minPrice);
    if (maxInput) maxInput.value = String(state.maxPrice);
    const minOutput = filtersMount.querySelector('[data-price-output="min"]');
    const maxOutput = filtersMount.querySelector('[data-price-output="max"]');
    if (minOutput) minOutput.textContent = bounds ? money.format(state.minPrice) : '—';
    if (maxOutput) maxOutput.textContent = bounds ? money.format(state.maxPrice) : '—';
    renderResults(resultsMount, matchingProducts, products.length > 0, hasActiveFilters(state, bounds));
    blendy?.update();
  };

  filtersMount.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button || button.disabled) return;

    if (button.hasAttribute('data-filter-type')) {
      const nextType = button.dataset.filterType;
      state.typeId = state.typeId === nextType ? null : nextType;
    } else if (button.hasAttribute('data-filter-skin')) {
      const id = button.dataset.filterSkin;
      state.skins.has(id) ? state.skins.delete(id) : state.skins.add(id);
    } else if (button.hasAttribute('data-filter-color')) {
      const id = button.dataset.filterColor;
      state.colors.has(id) ? state.colors.delete(id) : state.colors.add(id);
    } else if (button.hasAttribute('data-filter-brand')) {
      const id = button.dataset.filterBrand;
      state.brands.has(id) ? state.brands.delete(id) : state.brands.add(id);
    } else {
      return;
    }
    update();
  });

  filtersMount.addEventListener('input', (event) => {
    const input = event.target;
    if (input.matches('[data-price-min]')) state.minPrice = Math.min(Number(input.value), state.maxPrice);
    if (input.matches('[data-price-max]')) state.maxPrice = Math.max(Number(input.value), state.minPrice);
    if (input.matches('[data-price-min], [data-price-max]')) update();
  });

  clearButton.addEventListener('click', () => {
    state.typeId = null;
    state.skins.clear();
    state.colors.clear();
    state.brands.clear();
    if (bounds) {
      state.minPrice = bounds.min;
      state.maxPrice = bounds.max;
    }
    update();
  });

  update();
  if (detailDialog && detailSurface) blendy = createBlendy({ animation: 'dynamic' });
};
