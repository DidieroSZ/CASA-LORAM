import { gsap } from "gsap";
import catalog from "../data/skins.json";

const CARE_SECTIONS = [
  ["cleaning", "Limpieza"],
  ["maintenance", "Mantenimiento"],
  ["storage", "Almacenamiento"],
  ["precautions", "Precauciones"],
  ["professionalCare", "Cuidado profesional"],
];

const getCatalogEntries = () => {
  const skins = catalog.skins.filter((skin) => skin.active);
  const skinById = new Map(skins.map((skin) => [skin.id, skin]));
  const categories = catalog.categories
    .filter((category) => category.active)
    .map((category) => ({
      ...category,
      skins: (category.skinIds ?? [])
        .map((skinId) => skinById.get(skinId))
        .filter((skin) => skin && skin.categoryId === category.id),
    }))
    .filter((category) => category.skins.length > 0)
    .sort((a, b) => a.order - b.order);

  return { categories, skins, images: catalog.images };
};

const escapeHtml = (value = "") =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character],
  );

const renderList = (items = []) => {
  if (!Array.isArray(items) || items.length === 0) return "";
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
};

const renderCare = (care = {}) =>
  CARE_SECTIONS.map(([key, label]) => {
    const value = care[key];
    const content = Array.isArray(value)
      ? renderList(value)
      : typeof value === "string"
        ? escapeHtml(value)
        : "";
    return content
      ? `<div class="skin-care__item"><h5>${label}</h5>${content}</div>`
      : "";
  })
    .filter(Boolean)
    .join("");

const getSkinImage = (skin, images) =>
  (skin.imageIds ?? [])
    .map((imageId) =>
      images.find((image) => image.id === imageId && image.skinId === skin.id),
    )
    .find(Boolean);

const renderEmptyState = (mount) => {
  mount.innerHTML = `
    <div class="skin-empty" role="status">
      <span class="skin-empty__index">CL / MATERIALES</span>
      <div class="skin-empty__mark" aria-hidden="true">CL</div>
      <div class="skin-empty__message">
        <p class="skin-empty__eyebrow">Archivo de materiales</p>
        <h3>El catálogo de pieles<br /><em>está en preparación.</em></h3>
        <p>Los materiales aparecerán aquí cuando sus nombres, imágenes y cuidados estén confirmados.</p>
      </div>
      <span class="skin-empty__footnote">CASA LORAM · LEÓN, GTO.</span>
    </div>`;
};

const renderExplorer = (mount, data, activeCategoryId, activeSkinId) => {
  const category =
    data.categories.find((entry) => entry.id === activeCategoryId) ??
    data.categories[0];
  if (!category) {
    renderEmptyState(mount);
    return;
  }

  const skin =
    category.skins.find((entry) => entry.id === activeSkinId) ??
    category.skins[0];
  const image = getSkinImage(skin, data.images);
  const careMarkup = renderCare(skin.care);
  const characteristics = Array.isArray(skin.characteristics)
    ? skin.characteristics
    : [];

  mount.innerHTML = `
    <div class="skin-explorer__layout" id="skin-panel" role="tabpanel" aria-labelledby="skin-category-${escapeHtml(category.id)}">
      <figure class="skin-preview" data-skin-preview>
        ${image
      ? `<img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}" loading="lazy" />`
      : '<div class="skin-preview__unavailable" role="img" aria-label="Imagen de textura pendiente de confirmación"><span>Imagen<br />por confirmar</span></div>'
    }
        <figcaption>${image ? escapeHtml(image.role ?? "Detalle de material") : "CASA LORAM · MATERIAL"}</figcaption>
      </figure>

      <article class="skin-detail" id="skin-detail" data-skin-detail aria-live="polite" aria-atomic="true">
        <p class="skin-detail__category">${escapeHtml(category.name)}${skin.materialType ? ` · ${escapeHtml(skin.materialType)}` : ""}</p>
        <h3>${escapeHtml(skin.name)}</h3>
        <p class="skin-detail__description">${escapeHtml(skin.description)}</p>
        ${characteristics.length ? `<div class="skin-detail__characteristics"><h4>Características</h4>${renderList(characteristics)}</div>` : ""}
        <details class="skin-detail__care" open>
          <summary><span>Cuidados</span><span class="skin-care__toggle" aria-hidden="true"></span></summary>
          ${careMarkup || "<p>Consulta las recomendaciones de cuidado del fabricante o proveedor para esta pieza.</p>"}
        </details>
      </article>

      <div class="skin-options" aria-label="Pieles de ${escapeHtml(category.name)}">
        <p class="skin-options__label">Pieles <span>${String(category.skins.length).padStart(2, "0")}</span></p>
        <div class="skin-options__list" role="listbox" aria-label="Seleccionar piel">
          ${category.skins
      .map(
        (entry, index) => `
            <button class="skin-option${entry.id === skin.id ? " is-active" : ""}" id="skin-option-${escapeHtml(entry.id)}" type="button" role="option" aria-controls="skin-detail" aria-selected="${entry.id === skin.id}" tabindex="${entry.id === skin.id ? "0" : "-1"}" data-skin-id="${escapeHtml(entry.id)}">
              <span class="skin-option__number">${String(index + 1).padStart(2, "0")}</span>
              <span>${escapeHtml(entry.name)}</span>
            </button>`,
      )
      .join("")}
        </div>
      </div>

      <div class="skin-category-tabs" role="tablist" aria-label="Categorías de pieles" aria-orientation="vertical">
        ${data.categories
      .map(
        (entry) => `
          <button class="skin-category-tab${entry.id === category.id ? " is-active" : ""}" type="button" role="tab" id="skin-category-${escapeHtml(entry.id)}" aria-selected="${entry.id === category.id}" aria-controls="skin-panel" tabindex="${entry.id === category.id ? "0" : "-1"}" data-category-id="${escapeHtml(entry.id)}">
            <span>${escapeHtml(entry.name)}</span><small></small>
          </button>`,
      )
      .join("")}
      </div>
    </div>`;
};

export const initSkinExplorer = () => {
  const mount = document.querySelector("[data-skin-explorer]");
  if (!mount) return;

  const data = getCatalogEntries();
  if (data.categories.length === 0) {
    renderEmptyState(mount);
    return;
  }

  let activeCategoryId = data.categories[0].id;
  let activeSkinId = data.categories[0].skins[0].id;
  const tablistOrientation = window.matchMedia("(max-width: 760px)");
  const updateTabOrientation = () => {
    const tablist = mount.querySelector('[role="tablist"]');
    if (tablist)
      tablist.setAttribute(
        "aria-orientation",
        tablistOrientation.matches ? "horizontal" : "vertical",
      );
  };
  tablistOrientation.addEventListener("change", updateTabOrientation);

  const update = (
    nextCategoryId = activeCategoryId,
    nextSkinId = activeSkinId,
    focusTarget = null,
  ) => {
    activeCategoryId = nextCategoryId;
    activeSkinId = nextSkinId;
    renderExplorer(mount, data, activeCategoryId, activeSkinId);
    updateTabOrientation();
    if (focusTarget)
      mount
        .querySelector(`[data-${focusTarget.type}-id="${focusTarget.id}"]`)
        ?.focus();

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.fromTo(
        [
          mount.querySelector("[data-skin-preview]"),
          mount.querySelector("[data-skin-detail]"),
        ],
        { opacity: 0.45, y: 8 },
        {
          opacity: 1,
          y: 0,
          duration: 0.32,
          stagger: 0.04,
          ease: "power2.out",
          clearProps: "all",
        },
      );
    }
  };

  mount.addEventListener("click", (event) => {
    const categoryButton = event.target.closest("[data-category-id]");
    if (categoryButton) {
      const category = data.categories.find(
        (entry) => entry.id === categoryButton.dataset.categoryId,
      );
      if (category)
        update(category.id, category.skins[0].id, {
          type: "category",
          id: category.id,
        });
      return;
    }

    const skinButton = event.target.closest("[data-skin-id]");
    if (skinButton)
      update(activeCategoryId, skinButton.dataset.skinId, {
        type: "skin",
        id: skinButton.dataset.skinId,
      });
  });

  mount.addEventListener("keydown", (event) => {
    const tab = event.target.closest('[role="tab"]');
    const option = event.target.closest('[role="option"]');
    const control = tab ?? option;
    if (!control) return;

    const selector = tab ? '[role="tab"]' : '[role="option"]';
    const controls = [...mount.querySelectorAll(selector)];
    const index = controls.indexOf(control);
    let nextIndex = null;

    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = controls.length - 1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown")
      nextIndex = (index + 1) % controls.length;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp")
      nextIndex = (index - 1 + controls.length) % controls.length;
    if (nextIndex === null) return;

    event.preventDefault();
    controls[nextIndex].focus();
    controls[nextIndex].click();
  });

  update();
};
