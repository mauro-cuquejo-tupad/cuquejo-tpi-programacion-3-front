import { getPedidos, getProductos } from "../../../utils/fetch";
import type { CartItem, Product } from "../../../types/product";
import { agregarLogout, guardRoutes } from "../../../utils/auth";
import { addProductCart, deleteProductCart, getProductCart, removeAllProductsCart, removeProductCart } from "../../../utils/localStorage";
import { navigate } from "../../../utils/navigate";


const contadorCarrito: HTMLAnchorElement | null = document.querySelector<HTMLAnchorElement>("#a-carrito");

let carrito : HTMLElement | null = document.querySelector<HTMLElement>("#carrito");

//helpers DOM para crear elementos
const crearBoton = (id: string, classNames: string | null, textContent: string): HTMLButtonElement => {
  const boton: HTMLButtonElement = document.createElement("button");
  boton.id = id;
  boton.type = "button";
  if(classNames) boton.className = classNames;
  boton.textContent = textContent;
  return boton;
};

const crearItemCarritoVacio = (): HTMLDivElement => {
  let itemCarrito: HTMLDivElement = document.createElement("div");
    itemCarrito.classList.add("carrito-vacio");

  let iconoCarrito = document.createElement("h2");
  iconoCarrito.classList.add("emoji-carrito");
  iconoCarrito.textContent = "🛒";

  let descripcionCarrito = document.createElement("h2");
  descripcionCarrito.classList.add("descripcion-carrito");
  descripcionCarrito.textContent = "El carrito está vacío";

  const botonCarrito: HTMLButtonElement = crearBoton("btn-catalogo", null, "Ver catálogo");
  botonCarrito.addEventListener("click", () => navigate("/src/pages/store/home/home.html"));

  itemCarrito.appendChild(iconoCarrito);
  itemCarrito.appendChild(descripcionCarrito);
  itemCarrito.appendChild(botonCarrito);
  return itemCarrito;
};

const crearItemCarrito = (item: CartItem): HTMLDivElement => {
  let itemCarrito: HTMLDivElement = document.createElement("div");
  itemCarrito.classList.add("carrito-articulo");
  itemCarrito.id = item.id.toString();

  let divImagen: HTMLDivElement = document.createElement("div");

  const imagen: HTMLImageElement = document.createElement("img");
  imagen.src = `${item.producto.imagen}`;
  imagen.alt = item.producto.nombre;
  divImagen.appendChild(imagen);

  let divDatosCompra: HTMLDivElement = document.createElement("div");
  const titulo:HTMLHeadingElement = document.createElement("h2");
  titulo.classList.add("titulo-carrito");
  titulo.textContent = item.producto.nombre;

  const descripcion: HTMLParagraphElement = document.createElement("p");
  descripcion.classList.add("descripcion-carrito");
  descripcion.textContent = item.producto.categoria?.nombre ?? "";

  const precio: HTMLSpanElement = document.createElement("span");
  precio.classList.add("precio-carrito");
  precio.textContent = 'Subtotal: $' + item.producto.precio * item.cantidad;

  divDatosCompra.appendChild(titulo);
  divDatosCompra.appendChild(descripcion);
  divDatosCompra.appendChild(precio);

  let divModificarCantidad: HTMLDivElement = document.createElement("div");
  divModificarCantidad.classList.add("modificar-cantidad");
  let divAgregarOQuitarProductos: HTMLDivElement = document.createElement("div");
  const botonEliminar: HTMLButtonElement = crearBoton("btn-eliminar-" + item.producto.id, "btn-accion", `-`);
  botonEliminar.addEventListener("click", () => {
    eliminarDelCarrito(item.producto.id);
    actualizarContadorCarrito();
  });

  const cantidad: HTMLSpanElement = document.createElement("span");
  cantidad.classList.add("cantidad-carrito");
  cantidad.textContent = item.cantidad.toString();

  const botonAgregar: HTMLButtonElement = crearBoton("btn-agregar-" + item.producto.id, "btn-accion", `+`);
    botonAgregar.addEventListener("click", () => {
      agregarAlCarrito(item.producto.id);
      actualizarContadorCarrito();
    });

    divAgregarOQuitarProductos.appendChild(botonEliminar);
    divAgregarOQuitarProductos.appendChild(cantidad);
    divAgregarOQuitarProductos.appendChild(botonAgregar);

    const botonEliminarProducto: HTMLButtonElement = crearBoton("btn-eliminar-producto" + item.producto.id, "btn-eliminar-producto", `Eliminar Producto`);
    botonEliminarProducto.addEventListener("click", () => {
      eliminarProductoDelCarrito(item.producto.id);
      actualizarContadorCarrito();
    });

    divModificarCantidad.appendChild(divAgregarOQuitarProductos);
    divModificarCantidad.appendChild(botonEliminarProducto);


  itemCarrito.appendChild(divImagen);
  itemCarrito.appendChild(divDatosCompra);
  itemCarrito.appendChild(divModificarCantidad);
  return itemCarrito;
};

const crearDatosItemsCarrito = (carritoCompras: CartItem[]): HTMLDivElement => {
  let datosItemsCarrito: HTMLDivElement = document.createElement("div");
  carritoCompras.forEach((item: CartItem) => datosItemsCarrito.appendChild(crearItemCarrito(item)));
  return datosItemsCarrito;
};

const crearDatosTotalCarrito = (): HTMLDivElement => {
  let datosTotalCarrito: HTMLDivElement = document.createElement("div");
  datosTotalCarrito.classList.add("total-carrito");

  const tituloTotal:HTMLHeadingElement = document.createElement("h2");
  tituloTotal.classList.add("titulo-carrito");
  tituloTotal.textContent = "Resumen";

  const precioTotal: HTMLHeadingElement = document.createElement("h1");
  precioTotal.classList.add("precio-total");
  precioTotal.textContent = 'Total: $' + actualizarImporteTotalCarrito().toLocaleString('es-ES');

  const botonFinalizarCompra: HTMLButtonElement = crearBoton("btn-finalizar-compra", null, `Finalizar Compra`)
  botonFinalizarCompra.addEventListener("click", () => {
    //finalizar compra
    actualizarContadorCarrito();
  });
  botonFinalizarCompra.disabled = true;

  const advertenciaActualizacion: HTMLDivElement = document.createElement("div");
  advertenciaActualizacion.textContent = `⚠️ el checkout no está disponible en esta versión`;

  const botonVaciarCarrito: HTMLButtonElement = crearBoton("btn-vaciar-carrito", "btn-borrar", `Vaciar Carrito`);
  botonVaciarCarrito.addEventListener("click", () => {
    vaciarCarrito();
    actualizarContadorCarrito();
  });

  datosTotalCarrito.appendChild(tituloTotal);
  datosTotalCarrito.appendChild(precioTotal)
  datosTotalCarrito.appendChild(botonFinalizarCompra);
  datosTotalCarrito.appendChild(advertenciaActualizacion);
  datosTotalCarrito.appendChild(botonVaciarCarrito);
  return datosTotalCarrito;
};

//renderers
const inicializarVacia = (carrito: HTMLElement) => {
  carrito?.classList.remove("carrito");
  carrito.appendChild(crearItemCarritoVacio());
  actualizarContadorCarrito();
};

const inicializar = (carritoCompras: CartItem[]): void => {
  carrito?.classList.add("carrito");
  carrito?.appendChild(crearDatosItemsCarrito(carritoCompras));
  carrito?.appendChild(crearDatosTotalCarrito());

}

export const agregarAlCarrito = (idProducto: number): void => {
    const producto = getProductos.find((p: Product) => p.id === idProducto);
    if (!producto) return;

    addProductCart(producto);
    renderizarCarrito();
};

export const eliminarDelCarrito = (idProducto: number): void => {
    const producto = getProductos.find((p: Product) => p.id === idProducto);
    if (!producto) return;

    removeProductCart(producto);
    renderizarCarrito();
};

export const eliminarProductoDelCarrito = (idProducto: number): void => {
  const producto = getProductos.find((p: Product) => p.id === idProducto);
    if (!producto) return;

    removeAllProductsCart(producto);
    renderizarCarrito();
};

export const vaciarCarrito = (): void => {
  deleteProductCart();
  renderizarCarrito();
};

export const obtenerCarrito = (): CartItem[] => {
  let carrito: string | null = getProductCart();
  if(!carrito) return [];
  try {
    return JSON.parse(carrito);
  } catch (error) {
    console.error("error al buscar carrito")
      return [];
  }
};

const renderizarCarrito = (): void => {
  if (carrito) carrito.innerHTML = "";
  let carritoCompras: CartItem[] = obtenerCarrito();
  if(carritoCompras.length === 0) {
    if (carrito) inicializarVacia(carrito);
    return;
  }
  if (carrito) {
    inicializar(carritoCompras);
  }
};

//contador carrito
export const actualizarContadorCarrito = (): void => {
  if (!contadorCarrito) return;
  try {
    const datosCarritoRaw = getProductCart();
    const badge = contadorCarrito.querySelector<HTMLSpanElement>(".carrito-badge");
    if (!badge) return;

    if (!datosCarritoRaw) {
      badge.textContent = `0`;
      return;
    }
    const items: CartItem[] = JSON.parse(datosCarritoRaw);
    const total: number = items.reduce((acumulador: number, it: CartItem) => acumulador + (it.cantidad || 0), 0);
    badge.textContent = `${total}`;
  } catch (error) {
      const badge = contadorCarrito.querySelector<HTMLSpanElement>(".carrito-badge");

      if (badge) {
        badge.textContent = `0`;
      }
  }
};

export const actualizarStockDisponible = (producto: Product): number => {
  const datosCarritoRaw = getProductCart();
  console.log(datosCarritoRaw);
  if (!datosCarritoRaw) {
    return producto.stock;
  }
  const items: CartItem[] = JSON.parse(datosCarritoRaw);
  const item: CartItem | undefined = items.find((it: CartItem) => it.producto?.id === producto.id);

  console.log("producto: " + producto.id + ", item: " + item);
  if (!item) {
    return producto.stock;
  }
  return producto.stock - item.cantidad;
};

export const actualizarImporteTotalCarrito = (): number => {
  if (!contadorCarrito) return 0;
  try {
    const datosCarritoRaw = getProductCart();
    if (!datosCarritoRaw) {
      return 0;
    }
    const items: CartItem[] = JSON.parse(datosCarritoRaw);
    const total = items.reduce((acumulador: number, it: CartItem) => acumulador + (it.producto.precio * it.cantidad || 0), 0);
    return total;
  } catch (error) {
    return 0;
  }
};


//inicializar
agregarLogout();

contadorCarrito?.addEventListener("click", () => {
  navigate("/src/pages/store/cart/cart.html");
});

renderizarCarrito();
actualizarContadorCarrito();
guardRoutes();