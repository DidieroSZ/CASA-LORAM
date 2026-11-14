export const contactConfig = {
  phone: '+524774036803',
  whatsapp: '+524774036803',
  email: '',
  address: 'C. Taxco 303a, El Coecillo',
  city: 'León de los Aldama',
  state: 'Gto.',
  postalCode: '37260',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=C.%20Taxco%20303a%2C%20El%20Coecillo%2C%2037260%20Le%C3%B3n%20de%20los%20Aldama%2C%20Gto.',
  googleMapsEmbedUrl: 'https://maps.google.com/maps?q=C.%20Taxco%20303a%2C%20El%20Coecillo%2C%2037260%20Le%C3%B3n%20de%20los%20Aldama%2C%20Gto.&output=embed',
  schedule: [
    { days: 'Lunes a sábado', hours: '9:00 a.m.–7:00 p.m.' },
    { days: 'Domingo', hours: '9:00 a.m.–6:00 p.m.' },
  ],
  whatsappMessage: 'Hola, Casa Loram. Me gustaría recibir información sobre sus productos y colecciones.',
};

export const getWhatsAppUrl = (message) => {
  const phone = contactConfig.whatsapp.replace(/\D/g, '');
  const destination = phone ? `/${phone}` : '/';
  return `https://wa.me${destination}?text=${encodeURIComponent(message)}`;
};
