# AGENTS.md — Development Guidelines

## 1. Instrucciones generales de desarrollo

### Tecnología y stack
- Desarrolla toda la interfaz utilizando **HTML5, CSS3 y JavaScript Vanilla (ES Modules)**.
- Utiliza **Vite** como entorno de desarrollo y herramienta de compilación.
- Respeta siempre el stack tecnológico y la configuración existentes.
- No utilices frameworks como React, Vue, Angular o Lit.
- Prioriza soluciones nativas de JavaScript y CSS antes de implementar abstracciones adicionales.
- Mantén el código limpio, modular, semántico y fácil de mantener.

### Dependencias
- No instales nuevas dependencias.
- Antes de implementar una funcionalidad, verifica si puede resolverse con las herramientas y librerías disponibles.
- Revisa `package.json` para identificar las dependencias instaladas.
- No sustituyas ni actualices librerías existentes sin autorización.
- Evita dependencias innecesarias que incrementen el tamaño del proyecto.

### Regla principal
**Reutiliza las dependencias instaladas y mantén el código modular, consistente y fácil de mantener.**

---

## 2. Estructura del proyecto

Mantén una arquitectura sencilla, organizada y orientada a la separación de responsabilidades.

Estructura de referencia:

```text
project/
├── index.html
├── public/
│   ├── images/
│   ├── fonts/
│   └── icons/
├── src/
│   ├── styles/
│   │   ├── globalStyles.css
│   │   ├── header.css
│   │   ├── hero.css
│   │   ├── about.css
│   │   ├── services.css
│   │   ├── gallery.css
│   │   ├── contact.css
│   │   └── footer.css
│   └── js/
│       ├── main.js
│       ├── animations.js
│       └── interactions.js
├── package.json
└── AGENTS.md
```

La estructura es orientativa. Adáptala a los archivos existentes sin reorganizar innecesariamente el proyecto.

### Organización del HTML

- De preferencia, todas las secciones principales del sitio deben vivir dentro del mismo archivo `index.html`.
- No crear archivos HTML independientes para cada sección.
- Utiliza etiquetas semánticas de HTML5.
- Cada sección debe estar claramente identificada mediante comentarios de apertura y cierre.

Formato obligatorio:

```html
<!-- Section header INICIA -->
<header>
  <!-- Contenido del header -->
</header>
<!-- Section header FIN -->


<!-- Section hero INICIA -->
<section id="hero">
  <!-- Contenido del hero -->
</section>
<!-- Section hero FIN -->


<!-- Section about INICIA -->
<section id="about">
  <!-- Contenido de about -->
</section>
<!-- Section about FIN -->
```

Reglas:
- Utiliza nombres descriptivos para identificar cada sección.
- Mantén los comentarios de apertura y cierre.
- No mezcles contenido de diferentes secciones.
- Conserva una jerarquía HTML coherente.
- Evita crear contenedores innecesarios.
- Mantén los identificadores (`id`) únicos.

### Organización del CSS

Cada sección debe tener su propio archivo CSS.

Ejemplo:

- `header.css`: estilos del encabezado.
- `hero.css`: estilos de la sección principal.
- `about.css`: estilos de presentación.
- `services.css`: estilos de servicios.
- `gallery.css`: estilos de galerías.
- `contact.css`: estilos del formulario.
- `footer.css`: estilos del pie de página.

**globalStyles.css**

Este archivo será el punto central de los estilos compartidos y deberá contener:

- Variables CSS globales.
- Paleta de colores.
- Tipografías.
- Escalas de tamaños.
- Espaciados generales.
- Reset CSS.
- Estilos base de HTML.
- Clases utilitarias.
- Contenedores generales.
- Botones reutilizables.
- Estilos comunes de elementos compartidos.

Reglas:
- Todos los archivos CSS deben aprovechar las variables y clases comunes definidas en `globalStyles.css`.
- Evita duplicar variables, colores y estilos globales.
- No declares nuevamente estilos que ya existen en las clases compartidas.
- Utiliza variables CSS para mantener la consistencia visual.
- Mantén los estilos específicos de cada sección dentro de su archivo correspondiente.
- Evita selectores globales que puedan afectar otras secciones.
- Importa todos los archivos CSS desde el punto de entrada principal de JavaScript.

Ejemplo de importaciones:

```javascript
// Global styles
import './styles/globalStyles.css';

// Section styles
import './styles/header.css';
import './styles/hero.css';
import './styles/about.css';
import './styles/services.css';
import './styles/contact.css';
import './styles/footer.css';
```

---

## 3. JavaScript y funcionalidades

Utiliza JavaScript Vanilla con módulos ES.

Reglas:
- Separa las funcionalidades por responsabilidad.
- Evita concentrar toda la lógica en un único archivo.
- Utiliza funciones reutilizables.
- Evita variables globales innecesarias.
- Utiliza `const` por defecto y `let` cuando sea necesario.
- Utiliza `async/await` cuando corresponda.
- Implementa correctamente los eventos y sus respectivos manejadores.
- Evita duplicar lógica.
- No utilices JavaScript para resolver problemas que pueden solucionarse de forma más sencilla con CSS o HTML.

### Interacciones

Todas las interacciones deben funcionar realmente.

Ejemplos:
- Menús de navegación.
- Menús móviles.
- Botones.
- Formularios.
- Carruseles.
- Modales.
- Navegación entre secciones.
- Efectos de desplazamiento.
- Elementos interactivos.

No implementes elementos visuales que aparenten ser funcionales sin tener una interacción real.

---

## 4. Animaciones con GSAP

Utiliza **GSAP** para animaciones, transiciones e interacciones.

Prioriza:
- Movimientos fluidos.
- Transiciones naturales.
- Animaciones con propósito.
- Secuencias visuales coherentes.
- Buen rendimiento durante la ejecución.

### Reglas de implementación

- Utiliza GSAP para animaciones complejas y secuencias coordinadas.
- Utiliza `gsap.timeline()` cuando existan múltiples animaciones relacionadas.
- Aprovecha `ScrollTrigger` únicamente si está instalado.
- Evita animaciones innecesarias o excesivas.
- No animes propiedades que generen problemas de rendimiento cuando existan alternativas.
- Prioriza `transform` y `opacity`.
- Evita animaciones que bloqueen la interacción del usuario.
- Evita inicializar múltiples veces la misma animación.
- Mantén las animaciones organizadas y separadas de la lógica general.
- Limpia correctamente los eventos y triggers cuando sea necesario.
- Respeta la preferencia de movimiento reducido mediante `prefers-reduced-motion`.

### Organización

Centraliza las animaciones generales en:

`src/js/animations.js`

Las animaciones específicas pueden organizarse por funciones dentro del mismo archivo o en módulos independientes cuando la complejidad lo justifique.

No agregues animaciones únicamente por motivos decorativos. Cada movimiento debe contribuir a la experiencia de usuario.

---

## 5. Iconografía con Lucide

Utiliza **Lucide exclusivamente para los iconos de la interfaz**.

Aprovecha la implementación y las dependencias existentes en el proyecto.

### Implementación preferida

Utiliza la sintaxis:

```html
<i data-lucide="arrow-right"></i>
```

Ejemplos:

```html
<i data-lucide="menu"></i>
<i data-lucide="x"></i>
<i data-lucide="search"></i>
<i data-lucide="arrow-up-right"></i>
<i data-lucide="instagram"></i>
<i data-lucide="map-pin"></i>
```

### Reglas de uso

- Utiliza nombres oficiales de iconos de Lucide.
- Escribe los nombres en formato kebab-case.
- Verifica que el icono exista antes de utilizarlo.
- No inventes nombres de iconos.
- No utilices emojis como sustitutos de iconos.
- No utilices caracteres Unicode para representar iconografía.
- No mezcles diferentes bibliotecas de iconos.
- Evita utilizar SVG personalizados cuando exista un icono equivalente en Lucide.
- Utiliza iconos coherentes con la acción o el contenido que representan.

### Inicialización

Utiliza el mecanismo de inicialización de Lucide que ya exista en el proyecto.

Si se utiliza `createIcons()`, asegúrate de:

- Importar únicamente los iconos necesarios cuando la implementación lo permita.
- Inicializar los iconos después de que el DOM esté disponible.
- Volver a inicializarlos cuando se inserte nuevo contenido dinámicamente.
- Evitar inicializaciones redundantes.
- No importar toda la biblioteca sin necesidad.

### Tamaños y estilos

Controla las dimensiones y apariencia mediante CSS.

Ejemplo:

```css
[data-lucide] {
  width: 20px;
  height: 20px;
  stroke-width: 1.8;
  flex-shrink: 0;
}
```

Puedes establecer tamaños específicos mediante clases:

```css
.icon-sm {
  width: 16px;
  height: 16px;
}

.icon-md {
  width: 20px;
  height: 20px;
}

.icon-lg {
  width: 24px;
  height: 24px;
}
```

Reglas visuales:
- Mantén consistencia en tamaños y grosores.
- Utiliza `currentColor` para heredar el color del elemento.
- Evita deformar los iconos.
- Alinea correctamente los iconos con el texto.
- Mantén suficiente contraste.
- Utiliza `aria-hidden="true"` cuando el icono sea meramente decorativo.
- Proporciona nombres accesibles cuando un icono sea el único contenido de un botón.

---

## 6. Diseño responsive y accesibilidad

Todos los desarrollos deben contemplar diferentes tamaños de pantalla.

### Responsive Design

- Prioriza diseños adaptables.
- Utiliza CSS Grid y Flexbox.
- Evita dimensiones rígidas innecesarias.
- Utiliza unidades relativas cuando corresponda.
- Implementa media queries cuando sean necesarias.
- Verifica el comportamiento en dispositivos móviles, tablets y escritorio.
- Evita desbordamientos horizontales.
- Mantén una jerarquía visual coherente en todas las resoluciones.

### Accesibilidad

- Utiliza HTML semántico.
- Mantén una jerarquía correcta de encabezados.
- Incluye textos alternativos en imágenes informativas.
- Utiliza etiquetas correctamente asociadas a los campos de formulario.
- Asegura la navegación mediante teclado.
- Mantén estados de foco visibles.
- Utiliza atributos ARIA únicamente cuando sean necesarios.
- No dependas exclusivamente del color para transmitir información.

---

## 7. Rendimiento y buenas prácticas

- Optimiza las imágenes y utiliza formatos modernos cuando sea posible.
- Evita cargar recursos innecesarios.
- Implementa carga diferida para imágenes que no sean prioritarias.
- Evita manipulaciones innecesarias del DOM.
- Minimiza las operaciones costosas durante el desplazamiento.
- Evita duplicar código y estilos.
- Mantén las animaciones optimizadas.
- Evita errores y advertencias en la consola.
- Verifica que no existan recursos rotos.
- Utiliza correctamente los atributos `defer`, `async` y `loading` cuando corresponda.

---

## 8. Reglas de trabajo con Codex

### Antes de desarrollar

1. Inspecciona la estructura actual del proyecto.
2. Revisa `package.json` y las dependencias instaladas.
3. Identifica la implementación existente de GSAP y Lucide.
4. Comprende los estilos, variables y convenciones existentes.
5. Identifica los archivos que necesitan modificaciones.
6. Respeta las decisiones de arquitectura previamente establecidas.

### Durante el desarrollo

- Modifica únicamente los archivos necesarios.
- Reutiliza estilos, componentes y funciones existentes.
- Evita reescribir archivos completos sin justificación.
- No elimines funcionalidades existentes.
- No cambies la estructura del proyecto sin necesidad.
- No agregues dependencias.
- No realices commits automáticamente.
- No modifiques configuraciones de Vite sin justificación.
- No introduzcas soluciones más complejas de lo necesario.

### Después del desarrollo

1. Verifica que el proyecto compile correctamente.
2. Ejecuta las validaciones disponibles.
3. Comprueba que las interacciones funcionen.
4. Revisa el comportamiento responsive.
5. Comprueba las animaciones.
6. Verifica que los iconos se rendericen correctamente.
7. Revisa la consola en busca de errores.
8. Informa qué archivos fueron modificados y qué funcionalidades se implementaron.

---

## 9. Prioridades de desarrollo

Cuando existan diferentes formas de implementar una funcionalidad, sigue este orden:

1. Reutilizar código y dependencias existentes.
2. Utilizar HTML semántico y CSS nativo.
3. Resolver la funcionalidad con JavaScript Vanilla.
4. Aprovechar GSAP para animaciones.
5. Aprovechar Lucide para iconografía.
6. Implementar soluciones adicionales únicamente cuando sean necesarias y estén autorizadas.

### Regla final

El objetivo es desarrollar sitios web modernos, visualmente atractivos, responsivos y funcionales, manteniendo una arquitectura sencilla.

**Prioriza la simplicidad, la reutilización y la calidad del código. No agregues complejidad ni dependencias cuando no aporten un beneficio real al proyecto.**