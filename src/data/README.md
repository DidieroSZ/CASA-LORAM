# Catálogo de pieles

`skins.json` es la fuente canónica de nombres, categorías, cuidados e imágenes de cada piel. El catálogo de productos conserva los vínculos mediante sus IDs; no dupliques nombres ni listas inversas de productos.

## Agregar una piel

1. Añade un registro a `skins` con un `id` estable, `name`, `categoryId`, `description`, `characteristics`, `imageIds`, `care` y `active`.
2. Añade su `id` a `skinIds` de una categoría existente o crea una categoría con `id`, `name`, `description`, `skinIds`, `order` y `active`.
3. Registra cada fotografía en `images` con `id`, `src`, `alt`, `skinId` y `role` (`texture`, `detail` o `editorial`). En `imageIds`, usa los IDs de imagen; no construyas rutas desde el nombre de la piel.
4. Activa la categoría y la piel solo cuando los datos estén verificados. Las categorías sin pieles activas no aparecen.

`materialType` puede omitirse si no está confirmado. Mantén `characteristics` y `care` vacíos cuando no haya información fiable. Los recursos de imagen son opcionales; no reutilices fotografías genéricas de producto como si fueran muestras de una piel.

## Agregar productos al catálogo

`products.json` es la fuente del catálogo y de los filtros de piel, color, precio y marca. Cada registro puede incluir:

- `id`, `name`, `typeId` y `active`.
- `skinIds`, una lista opcional de IDs que deben coincidir con pieles activas de `skins.json`. Usa solo asociaciones confirmadas; un producto puede tener cero, una o varias pieles.
- `colorId`, `colorName` y `colorHex` (hexadecimal `#RRGGBB`).
- `price` como número en pesos mexicanos.
- `brand`, usando el nombre comercial confirmado.
- `imageSrc` e `imageAlt` cuando exista fotografía de producto.

`typeId` debe ser uno de los identificadores de categoría definidos en `src/js/productCatalog.js`: `sombreros`, `texanas`, `botas`, `botines` o `cinturones`. Las opciones de piel, color y precio se derivan de los productos activos. El filtro de varias pieles usa coincidencia OR entre las pieles seleccionadas y se combina con los otros filtros. Las marcas conocidas aparecen desactivadas hasta que un producto las respalde.
