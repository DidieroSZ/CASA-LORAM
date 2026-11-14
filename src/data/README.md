# Catálogo de pieles

`skins.json` es la única fuente de datos del explorador. Las listas están vacías hasta que Casa Loram confirme los materiales y sus recursos; el estado vacío de la interfaz se mantiene mientras no haya categorías publicables.

## Agregar una piel

1. Añade un registro a `skins` con un `id` estable, `name`, `categoryId`, `description`, `characteristics`, `imageIds`, `care`, `productIds` y `active`.
2. Añade su `id` a `skinIds` de una categoría existente o crea una categoría con `id`, `name`, `description`, `skinIds`, `order` y `active`.
3. Registra cada fotografía en `images` con `id`, `src`, `alt`, `skinId` y `role` (`texture`, `detail` o `editorial`). En `imageIds`, usa los IDs de imagen; no construyas rutas desde el nombre de la piel.
4. Activa la categoría y la piel solo cuando los datos estén verificados. Las categorías sin pieles activas no aparecen.

`materialType` puede omitirse si no está confirmado. Mantén `characteristics`, `care` y `productIds` vacíos cuando no haya información fiable. Los productos aún no tienen un catálogo de datos en el proyecto; no agregues IDs de productos hasta que exista y use estos mismos IDs de piel.

## Agregar productos al catálogo

`products.json` es la fuente del catálogo y de los filtros de piel, color, precio y marca. Cada registro puede incluir:

- `id`, `name`, `typeId` y `active`.
- `skinId`, que debe coincidir con una piel activa de `skins.json`.
- `colorId`, `colorName` y `colorHex` (hexadecimal `#RRGGBB`).
- `price` como número en pesos mexicanos.
- `brand`, usando el nombre comercial confirmado.
- `imageSrc` e `imageAlt` cuando exista fotografía de producto.

`typeId` debe ser uno de los identificadores de categoría definidos en `src/js/productCatalog.js`: `sombreros`, `texanas`, `botas`, `botines` o `cinturones`. Las opciones de piel, color y precio se derivan de los productos activos; los filtros siguen visibles cuando aún no tienen opciones. Las marcas conocidas aparecen desactivadas hasta que un producto las respalde.
