# SEO y medición de Casa Loram

## Destinos para posicionamiento y campañas

El sitio es una página de destino con secciones enlazadas por anclas, no páginas independientes. Los destinos actuales son:

- Inicio y propuesta de marca: `/#inicio`
- Catálogo y categorías de producto: `/#catalogo`
- Materiales y guía de cuidado: `/#coleccion`
- Contacto, WhatsApp y showroom: `/#contacto`

Para Google Ads se pueden usar esos destinos tras publicar la URL final. Una campaña dedicada por categoría necesitaría páginas indexables propias; no se deben anunciar anclas como si fueran páginas separadas. El catálogo que está en el repositorio contiene productos y precios de muestra, así que hay que reemplazar esos datos antes de campañas de producto, anuncios con precio o datos estructurados `Product`.

## Eventos preparados

La capa `window.dataLayer` registra, sin datos personales:

- `section_navigation`: navegación a secciones internas.
- `select_content`: selección de categorías del catálogo o de pieles.
- `whatsapp_click`: clic a WhatsApp, incluyendo ubicación del enlace.
- `product_inquiry`: clic de consulta en una ficha de producto.
- `contact_click`: clic al teléfono.
- `generate_lead`: envío válido del formulario de consulta, con método y categoría seleccionada.

No hay etiquetas de GA4 o GTM instaladas todavía. Para activarlas, crear la propiedad y contenedor reales, configurar el consentimiento de cookies que corresponda y conectar las etiquetas con esos eventos. `generate_lead` puede marcarse como conversión de contacto. `product_inquiry` puede utilizarse como conversión secundaria. Los clics no confirman que el usuario haya enviado un mensaje en WhatsApp.

## Pendientes al publicar

- Confirmar que la URL pública sea `https://didierosz.github.io/CASA-LORAM/`. Si se usa dominio propio o subruta distinta, actualizar canonical, `og:url`, `robots.txt` y `sitemap.xml` en conjunto.
- En GitHub Pages de proyecto, `robots.txt` se publica dentro de `/CASA-LORAM/`; los robots estándar consultan el archivo en la raíz del host. Si se requiere una política de rastreo efectiva, usar un dominio propio o configurar el host para servir el archivo en raíz.
- Crear una imagen social optimizada de 1200 × 630 y añadir `og:image` absoluto; no hay un recurso de marca con ese formato listo en el proyecto.
- Registrar el sitemap en Google Search Console y Bing Webmaster Tools; solicitar indexación tras el despliegue.
- Confirmar Analytics, Google Ads y consentimiento antes de cargar identificadores. Ningún ID está supuesto en el código.
- Medir Core Web Vitals en producción con PageSpeed Insights o CrUX. La compilación no aporta datos de LCP, INP ni CLS de usuarios reales.
- Reducir y servir en WebP/AVIF las imágenes grandes del catálogo y hero; algunas imágenes fuente del repositorio superan 2 MB.
- Mantener el texto de productos de muestra claramente separado del catálogo comercial real.

## Enfoque de búsqueda

Botas western, botas de piel, botines, texanas, sombreros vaqueros, cinturones de piel, accesorios western, pieles y materiales, tienda western en León, Guanajuato. Se usan como términos descriptivos, sin afirmar disponibilidad real por modelo.
