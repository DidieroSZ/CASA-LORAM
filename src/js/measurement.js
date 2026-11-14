export const trackEvent = (event, parameters = {}) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...parameters });
};

export const initMeasurementEvents = () => {
  window.dataLayer = window.dataLayer || [];

  document.addEventListener('click', (event) => {
    const target = event.target.closest('a, button');
    if (!target) return;

    if (target.matches('a[href^="https://wa.me/"]')) {
      const product = target.closest('.product-detail');
      trackEvent('whatsapp_click', { link_location: product ? 'product_detail' : 'contact', ...(product ? { item_name: product.querySelector('h2')?.textContent.trim() } : {}) });
      if (product) trackEvent('product_inquiry', { item_name: product.querySelector('h2')?.textContent.trim(), contact_method: 'whatsapp' });
    }

    if (target.matches('a[href^="tel:"]')) trackEvent('contact_click', { contact_method: 'phone' });

    if (target.matches('a[href^="#"]')) {
      const section = target.getAttribute('href').slice(1);
      if (section) trackEvent('section_navigation', { section_id: section });
    }

    if (target.matches('[data-filter-type], [data-category-id]')) {
      const selectedName = target.textContent.trim();
      trackEvent('select_content', { content_type: target.hasAttribute('data-filter-type') ? 'product_category' : 'skin_category', item_id: target.dataset.filterType ?? target.dataset.categoryId, item_name: selectedName });
    }
  });
};
