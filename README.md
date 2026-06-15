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

## Consideraciones Técnicas

- **Tecnologías:** HTML5, CSS3, JavaScript, TypeScript
- **Build tool:** Vite
- **Package manager:** pnpm
- **Sin frameworks:** La aplicación usa vanilla JavaScript/TypeScript
- **Persistencia:** localStorage para carrito, filtros y datos de usuario
- **Gestión de rutas:** Guardia centralizada por roles (admin/client)

## Estructura del Proyecto

```
src/
├── pages/
│   ├── store/
│   │   ├── home/
│   │   │   ├── home.html          ← Catálogo de productos
│   │   │   └── home.ts            ← Lógica: render, búsqueda, filtros
│   │   └── cart/
│   │       ├── cart.html          ← Vista del carrito
│   │       └── cart.ts            ← Lógica: render, cantidades, total
│   ├── auth/
│   │   ├── login/
│   │   │   ├── login.html
│   │   │   └── login.ts
│   │   └── registro/
│   │       ├── registro.html
│   │       └── registro.ts
│   └── admin/
│       └── home/
│           ├── home.html
│           └── home.ts
├── types/
│   ├── product.ts                 ← Interfaces Product y CartItem
│   ├── categoria.ts               ← Interface ICategoria
│   ├── IUser.ts
│   └── Rol.ts
├── data/
│   └── data.ts                    ← PRODUCTS y categorias
├── utils/
│   ├── localStorage.ts            ← Gestión de persistencia
│   ├── navigate.ts                ← Helper de navegación
│   └── auth.ts
├── main.ts                        ← Guard global de rutas
├── style.css
└── vite-env.d.ts
```

## Comportamiento de la Aplicación

### Catálogo de Productos
- Renderizado dinámico del listado de productos
- Campo de búsqueda en tiempo real
- Filtrado por categoría desde menú lateral
- Botón para agregar productos al carrito
- Indicador visual al agregar un producto

### Carrito de Compras
- Visualización de todos los productos agregados
- Cantidad modifiable con botones +/-
- Eliminación individual de productos
- Cálculo automático del total
- Botón para vaciar el carrito
- Cantidad total de items del carrito visible en el header


## Comportamiento de la Aplicación relacionado con ampliación del TP 4.
### Autenticación y Autorización
- Login y registro de usuarios
- Creación de usuario admin default.
- Protección de rutas por rol (admin/client)
- Guardias centralizadas en [src/main.ts](src/main.ts)
- Corregido error en guardia centralizada al acceder a rutas no existentes.
- Sesión persistida en localStorage de usuarios registrados y usuario logueado actualmente.
- Logout que limpia sesión y filtros de búsqueda.
- Descentralización de lógica por preparación para futuro agregado de backend.

## Instalación y Ejecución

### Requisitos
- Node.js (v16+)
- pnpm

### Pasos

1. Instalar pnpm:

```bash
npm install -g pnpm
```

2. Clonar o descargar el proyecto ([Link al Repositorio](https://github.com/mauro-cuquejo-tupad/Cuquejo_Mauro_TP_TypeScript)) e instalar dependencias:

```bash
pnpm install
```

3. Iniciar servidor de desarrollo:

```bash
pnpm dev
```

4. Abrir la URL (`http://localhost:5173`)
