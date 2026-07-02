# Parcial 1 - Programación 3 - TUPaD

### Mauro Cuquejo
### Comisión 12.

## Requerimientos Implementados

### 1. Carrito Básico con Persistencia

- ✅ Agregar productos desde el catálogo.
- ✅ Visualizar, modificar cantidad y eliminar productos agregados desde vista de carrito de compras.
- ✅ Mostrar nombre, precio y cantidad de cada producto.
- ✅ Calcular y mostrar el total de la compra, actualizado en tiempo real.
- ✅ Persistencia con localStorage.

**Archivos:**
- [src/pages/store/cart/cart.html](src/pages/store/cart/cart.html) — Interfaz del carrito
- [src/pages/store/cart/cart.ts](src/pages/store/cart/cart.ts) — Lógica: renderizado, cantidades, cálculo de total

### 2. Búsqueda y Filtrado de Productos

- ✅ Búsqueda de productos por nombre.
- ✅ Filtrado por categoría desde menú lateral.
- ✅ Combinación de búsqueda y filtros.
- ✅ Persistencia de filtros en localStorage.

**Archivos:**
- [src/pages/store/home/home.html](src/pages/store/home/home.html) — Catálogo de productos
- [src/pages/store/home/home.ts](src/pages/store/home/home.ts) — Lógica: renderizado, búsqueda, filtros

### 3. Módulo de Administración (Panel Admin)

- ✅ **Sidebar de Navegación**: Panel lateral izquierdo para alternar fácilmente entre secciones del administrador (Dashboard, Categorías, Productos, Pedidos).
- ✅ **Dashboard con Estadísticas**: Tarjetas resumen que muestran la cantidad total de Categorías, Productos, Pedidos y Productos Activos, con accesos directos de gestión.
- ✅ **Resumen Rápido de Métricas**: Indicadores de control detallados:
  - Ingresos Totales (calculado en tiempo real a partir del total facturado).
  - Cantidad de Pedidos Pendientes.
  - Cantidad de Pedidos En Preparación.
  - Cantidad de Pedidos Completados.
- ✅ **Gestión y CRUD de Categorías**: Tabla con listado completo, botón de creación, edición y eliminación (borrado lógico: `eliminado: true`) mediante modales dinámicos.
- ✅ **Gestión y CRUD de Productos**: Tabla con imágenes, categorización dinámica basada en categorías activas, creación y edición con validaciones de precio (> 0) y stock (>= 0), y eliminación lógica.
- ✅ **Gestión de Pedidos y Estados**: Filtros de pedidos en tiempo real con modal detallado de artículos y datos de envío, y selector editable para actualizar el estado del pedido (`PENDIENTE`, `CONFIRMADO`, `EN_PREPARACION`, `ENTREGADO`, `CANCELADO`).
- ✅ **Formulario de Checkout y Datos de Envío**: Formulario modal en el carrito de compras para ingresar celular, dirección de entrega, método de pago y notas opcionales, con auto-guardado en sesión.
- ✅ **Detalle de Historial del Cliente**: Tarjetas de pedidos en el historial del cliente interactivas que abren un desglose pormenorizado de artículos, costos (envío de $500 y subtotal) y badges de estado unificados por CSS.

**Archivos:**
- [src/pages/admin/adminHome/adminHome.html](src/pages/admin/adminHome/adminHome.html) & [adminHome.ts](src/pages/admin/adminHome/adminHome.ts) — Dashboard administrativo
- [src/pages/admin/categories/categories.html](src/pages/admin/categories/categories.html) & [categories.ts](src/pages/admin/categories/categories.ts) — CRUD de categorías
- [src/pages/admin/products/products.html](src/pages/admin/products/products.html) & [products.ts](src/pages/admin/products/products.ts) — CRUD de productos
- [src/pages/admin/orders/orders.html](src/pages/admin/orders/orders.html) & [orders.ts](src/pages/admin/orders/orders.ts) — Gestión de pedidos
- [src/pages/client/orders/orders.html](src/pages/client/orders/orders.html) & [orders.ts](src/pages/client/orders/orders.ts) — Historial detallado de pedidos

---

## Consideraciones Técnicas

- **Tecnologías:** HTML5, CSS3, JavaScript, TypeScript.
- **Build tool:** Vite (configuración multipágina en `vite.config.ts` para compilar y empaquetar todas las vistas del panel de administración).
- **Package manager:** pnpm.
- **Sin frameworks:** La aplicación usa vanilla JavaScript/TypeScript puro.
- **Persistencia:** localStorage para guardar datos de sesión de usuarios, estado del carrito y filtros de búsqueda.
- **Gestión de rutas:** Guardia centralizada por roles (`ADMIN`/`USUARIO`) en `src/utils/auth.ts`. Se implementó un control de concurrencia (`guardDeRutasEnEjecucion`) para evitar alertas y redirecciones redundantes durante el ciclo de vida de la página.

---

## Estructura del Proyecto

```
src/
├── pages/
│   ├── store/
│   │   ├── home/
│   │   │   ├── home.html          ← Catálogo de productos
│   │   │   └── home.ts            ← Lógica: render, búsqueda, filtros
│   │   ├── cart/
│   │   │   ├── cart.html          ← Vista del carrito
│   │   │   └── cart.ts            ← Lógica: render, cantidades, total
│   │   └── productDetail/
│   │       ├── productDetail.html ← Detalle de producto
│   │       └── productDetail.ts   ← Lógica: visualización y controles
│   ├── auth/
│   │   └── login/
│   │       ├── login.html
│   │       └── login.ts
│   ├── client/
│   │   └── orders/
│   │       ├── orders.html        ← Mis Pedidos (Historial cliente)
│   │       └── orders.ts          ← Lógica: render y filtros cliente
│   └── admin/
│       ├── adminHome/
│       │   ├── adminHome.html     ← Dashboard Admin
│       │   └── adminHome.ts       ← Métricas e ingresos admin
│       ├── categories/
│       │   ├── categories.html    ← Gestión de Categorías
│       │   └── categories.ts      ← Lógica: listado de categorías
│       ├── products/
│       │   ├── products.html      ← Gestión de Productos
│       │   └── products.ts        ← Lógica: listado de productos
│       └── orders/
│           ├── orders.html        ← Gestión de Pedidos
│           └── orders.ts          ← Lógica: listado y filtros admin
├── types/
│   ├── product.ts                 ← Interfaces Product y CartItem
│   ├── categoria.ts               ← Interface ICategoria
│   ├── IUser.ts
│   ├── Rol.ts
│   ├── estados.ts
│   ├── formaPago.ts
│   ├── pedido.ts
│   └── usuario.ts
├── data/
│   ├── usuarios.json              ← Datos de usuarios por defecto
│   ├── categorias.json
│   ├── productos.json
│   └── pedidos.json
├── utils/
│   ├── localStorage.ts            ← Persistencia
│   ├── navigate.ts                ← Helper de navegación
│   ├── routes.ts                  ← Rutas y páginas válidas
│   └── auth.ts                    ← Lógica de login, logout y guards
├── main.ts                        ← Punto de entrada de la aplicación
└── style.css                      ← Estilos generales del proyecto
```

---

## Comportamiento de la Aplicación

### Catálogo de Productos (Cliente)
- Renderizado dinámico del listado de productos.
- Campo de búsqueda y ordenamiento de catálogo en tiempo real.
- Filtrado por categoría desde menú lateral.
- Botón para agregar productos al carrito y ver detalle.

### Carrito de Compras
- Visualización de todos los productos agregados.
- Cantidades modificables con botones `+/-`.
- Eliminación de productos individuales.
- Cálculo automático del total de compra.
- Botón para vaciar el carrito y persistencia entre sesiones.

### Panel de Administración (Admin)
- Dashboard con estadísticas automáticas y resumen detallado de ingresos y estados de pedidos.
- Navegación lateral consistente.
- Tablas autogeneradas para consultar Productos, Categorías y Pedidos existentes.

### Autenticación y Autorización
- Inicio de sesión validado contra datos locales persistentes.
- Redirección automática de páginas según el rol del usuario actual.
- Cierre de sesión que limpia el estado de filtros y limpia el almacenamiento del usuario actual.

---

## Instalación y Ejecución

### Requisitos
- Node.js (v16+)
- pnpm

### Pasos

1. Instalar pnpm (si no está instalado):

```bash
npm install -g pnpm
```

2. Instalar dependencias:

```bash
pnpm install
```

3. Iniciar el servidor de desarrollo:

```bash
pnpm dev
```

4. Abrir la URL en el navegador (`http://localhost:5173`)


### Link al video de Youtube
[Video](https://youtu.be/iOQCM7DvxXs)

### Link al PDF
[PDF](Cuquejo_Mauro_TPI_Prog3.pdf)