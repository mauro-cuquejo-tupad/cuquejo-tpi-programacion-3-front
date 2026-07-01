import type { CartItem, Product } from "../../../types/product";
import { guardRoutes, getSessionUser, saveSessionUser } from "../../../utils/auth";
import { addProductCart, deleteProductCart, getProductCart, removeAllProductsCart, removeProductCart } from "../../../utils/cartService";
import { getProductos, getProductosAdmin, getPedidos, savePedidos, saveProductos } from "../../../utils/fetch";
import { navigate } from "../../../utils/navigate";
import { agregarLogout, crearBoton } from "../../../utils/helpersDom";
import { CART_PAGE, HOME_STORE, ORDER_PAGE, PRODUCT_DETAIL } from "../../../utils/routes";
import type { Pedido, DetallePedido } from "../../../types/pedido";
import type { Usuario } from "../../../types/usuario";
import type { Rol } from "../../../types/Rol";
import type { Estados } from "../../../types/estados";
import type { FormaDePago } from "../../../types/formaPago";


const contadorCarrito: HTMLAnchorElement | null = document.querySelector<HTMLAnchorElement>("#a-carrito");

let carrito: HTMLElement | null = document.querySelector<HTMLElement>("#carrito");



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
  botonCarrito.addEventListener("click", () => navigate(HOME_STORE));

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

  imagen.addEventListener("click", () => {
    navigate(PRODUCT_DETAIL + "?id=" + item.producto.id + "&origen=cart");
  });

  divImagen.appendChild(imagen);


  let divDatosCompra: HTMLDivElement = document.createElement("div");
  divDatosCompra.classList.add("contenedor-datos-producto");
  const titulo: HTMLHeadingElement = document.createElement("h2");
  titulo.classList.add("titulo-carrito");
  titulo.textContent = item.producto.nombre;

  const descripcion: HTMLParagraphElement = document.createElement("p");
  descripcion.classList.add("descripcion-carrito");
  descripcion.textContent = item.producto.categoria?.nombre ?? "";

  const precio: HTMLSpanElement = document.createElement("span");
  precio.textContent = 'Precio: $' + item.producto.precio + ' c/u';

  const subtotal: HTMLSpanElement = document.createElement("span");
  subtotal.classList.add("precio-carrito");
  subtotal.textContent = 'Subtotal: $' + item.producto.precio * item.cantidad;

  divDatosCompra.appendChild(titulo);
  divDatosCompra.appendChild(descripcion);
  divDatosCompra.appendChild(precio);
  divDatosCompra.appendChild(subtotal);

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

  const actualizarBotones = (): void => {
    botonAgregar.disabled = item.cantidad >= item.producto.stock || item.producto.disponible === false;
    console.log(item.cantidad >= item.producto.stock);

    botonAgregar.classList.toggle(
      "boton-deshabilitado",
      botonAgregar.disabled
    );
  };

  botonAgregar.addEventListener("click", () => {
    agregarAlCarrito(item.producto.id);
    actualizarContadorCarrito();
    actualizarBotones();
  });

  actualizarBotones();

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
  datosItemsCarrito.classList.add("carrito-articulos-lista");
  carritoCompras.forEach((item: CartItem) => datosItemsCarrito.appendChild(crearItemCarrito(item)));
  return datosItemsCarrito;
};

const crearDatosTotalCarrito = (): HTMLDivElement => {
  let datosTotalCarrito: HTMLDivElement = document.createElement("div");
  datosTotalCarrito.classList.add("total-carrito");

  const tituloTotal: HTMLHeadingElement = document.createElement("h2");
  tituloTotal.classList.add("titulo-carrito");
  tituloTotal.textContent = "Resumen";

  let totalCarrito = actualizarImporteTotalCarrito();
  const subtotal: HTMLSpanElement = document.createElement("span");
  subtotal.classList.add("advertencia-compra");
  subtotal.textContent = `Subtotal: $${totalCarrito.toLocaleString('es-ES')}`;

  const envio: number = 500;
  const costoEnvio: HTMLSpanElement = document.createElement("span");
  costoEnvio.classList.add("advertencia-compra");
  costoEnvio.textContent = `Costo Envío: $${envio.toLocaleString('es-ES')}`;

  const linea: HTMLHRElement = document.createElement("hr");

  const precioTotal: HTMLHeadingElement = document.createElement("h1");
  precioTotal.classList.add("precio-total");
  precioTotal.textContent = 'Total: $' + (totalCarrito + envio).toLocaleString('es-ES');

  const botonVaciarCarrito: HTMLButtonElement = crearBoton("btn-vaciar-carrito", "btn-borrar", `Vaciar Carrito`);
  botonVaciarCarrito.addEventListener("click", () => {
    vaciarCarrito();
    actualizarContadorCarrito();
  });

  const botonProcederPago: HTMLButtonElement = crearBoton("btn-proceder-pago", "btn-agregar", `Proceder al Pago`);
  botonProcederPago.style.marginTop = "1rem";
  botonProcederPago.addEventListener("click", () => {
    if (validarStock()) {
      abrirModalCheckout();
    }
  });

  datosTotalCarrito.appendChild(tituloTotal);
  datosTotalCarrito.appendChild(subtotal);
  datosTotalCarrito.appendChild(costoEnvio);
  datosTotalCarrito.appendChild(linea);
  datosTotalCarrito.appendChild(precioTotal);
  datosTotalCarrito.appendChild(botonVaciarCarrito);
  datosTotalCarrito.appendChild(botonProcederPago);
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

export const agregarAlCarrito = (idProducto: number, cantidad: number = 1): void => {
  const producto = getProductos().find((p: Product) => p.id === idProducto);
  if (!producto) return;

  addProductCart(producto, cantidad);
  renderizarCarrito();
};

export const eliminarDelCarrito = (idProducto: number): void => {
  const producto = getProductos().find((p: Product) => p.id === idProducto);
  if (!producto) return;

  removeProductCart(producto);
  renderizarCarrito();
};

export const eliminarProductoDelCarrito = (idProducto: number): void => {
  const producto = getProductos().find((p: Product) => p.id === idProducto);
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
  if (!carrito) return [];
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
  if (carritoCompras.length === 0) {
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

export const getCantidadEnCarrito = (producto: Product): number => {
  const datosCarritoRaw = getProductCart();
  if (!datosCarritoRaw) {
    return 0;
  }
  const items: CartItem[] = JSON.parse(datosCarritoRaw);
  const item: CartItem | undefined = items.find((it: CartItem) => it.producto?.id === producto.id);

  if (!item) {
    return 0;
  }
  return item.cantidad;
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


const validarStock = (): boolean => {
  const cartItems = obtenerCarrito();
  const dbProducts = getProductosAdmin();

  for (const item of cartItems) {
    const dbProd = dbProducts.find(p => p.id === item.producto.id);
    if (!dbProd) {
      alert(`El producto "${item.producto.nombre}" ya no está disponible en el catálogo.`);
      return false;
    }
    if (item.cantidad > dbProd.stock) {
      alert(`No hay suficiente stock para "${item.producto.nombre}".\nStock disponible: ${dbProd.stock}.\nTienes en el carrito: ${item.cantidad}.`);
      return false;
    }
  }
  return true;
};

const modalCheckout = document.querySelector<HTMLDivElement>("#checkout-modal");
const formCheckout = document.querySelector<HTMLFormElement>("#form-checkout");
const btnCerrarCheckout = document.querySelector<HTMLButtonElement>("#btn-cerrar-checkout");
const btnCancelarCheckout = document.querySelector<HTMLButtonElement>("#btn-checkout-cancelar");
const checkoutSummaryItems = document.querySelector<HTMLDivElement>("#checkout-summary-items");
const checkoutSummaryTotal = document.querySelector<HTMLSpanElement>("#checkout-summary-total");

const abrirModalCheckout = (): void => {
  if (!modalCheckout) return;

  const cartItems = obtenerCarrito();
  if (checkoutSummaryItems) {
    checkoutSummaryItems.innerHTML = "";
    cartItems.forEach(item => {
      const summaryRow = document.createElement("div");
      summaryRow.classList.add("checkout-summary-item");
      summaryRow.innerHTML = `
        <span>${item.producto.nombre} x${item.cantidad}</span>
        <span>$${(item.producto.precio * item.cantidad).toLocaleString('es-ES')}</span>
      `;
      checkoutSummaryItems.appendChild(summaryRow);
    });
  }

  const subtotal = actualizarImporteTotalCarrito();
  const total = subtotal + 500;
  if (checkoutSummaryTotal) {
    checkoutSummaryTotal.textContent = `$${total.toLocaleString('es-ES')}`;
  }

  // Precompletar el teléfono si está guardado en el usuario
  const userSession = getSessionUser();
  if (userSession) {
    const telInput = document.querySelector<HTMLInputElement>("#checkout-tel");
    if (telInput && userSession.celular) {
      telInput.value = userSession.celular;
    }
  }

  modalCheckout.classList.add("activo");
};

const cerrarModalCheckout = (): void => {
  if (!modalCheckout) return;
  modalCheckout.classList.remove("activo");
  formCheckout?.reset();
};

btnCerrarCheckout?.addEventListener("click", cerrarModalCheckout);
btnCancelarCheckout?.addEventListener("click", cerrarModalCheckout);

formCheckout?.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault();

  if (!validarStock()) {
    return;
  }

  const telInput = document.querySelector<HTMLInputElement>("#checkout-tel");
  const dirInput = document.querySelector<HTMLInputElement>("#checkout-dir");
  const pagoSelect = document.querySelector<HTMLSelectElement>("#checkout-pago");
  const notasTextarea = document.querySelector<HTMLTextAreaElement>("#checkout-notas");

  const telefono = telInput?.value.trim() || "";
  const direccion = dirInput?.value.trim() || "";
  const formaPago = pagoSelect?.value as FormaDePago;
  const notas = notasTextarea?.value.trim() || "";

  if (!telefono || !direccion || !formaPago) {
    alert("Por favor, complete todos los campos obligatorios.");
    return;
  }

  const userSession = getSessionUser();
  if (!userSession) {
    alert("Inicie sesión para completar la compra.");
    return;
  }

  const cartItems = obtenerCarrito();
  const subtotal = actualizarImporteTotalCarrito();
  const totalPedido = subtotal + 500;

  // 1. Crear el Pedido
  const nuevoPedidoId = Date.now();
  const detalles: DetallePedido[] = cartItems.map((item) => ({
    cantidad: item.cantidad,
    subtotal: item.producto.precio * item.cantidad,
    producto: item.producto
  }));

  const usuarioDto: Usuario = {
    id: Date.now() + 50,
    nombre: userSession.nombre || userSession.email.split("@")[0],
    apellido: "",
    mail: userSession.email,
    rol: "USUARIO" as Rol,
    password: "",
    celular: telefono
  };

  // Guardar el número de celular ingresado en la sesión del usuario para futuras compras
  userSession.celular = telefono;
  saveSessionUser(userSession);

  const nuevoPedido: Pedido = {
    id: nuevoPedidoId,
    fecha: new Date().toISOString().split('T')[0],
    estado: "PENDIENTE" as Estados,
    total: totalPedido,
    formaPago: formaPago,
    detalles: detalles,
    usuarioDto: usuarioDto,
    telefono: telefono,
    direccion: direccion,
    notas: notas
  };

  // 2. Guardar Pedido en localStorage (mediante fetch.ts)
  const pedidos = getPedidos();
  pedidos.push(nuevoPedido);
  savePedidos(pedidos);

  // 3. Decrementar Stock en localStorage (mediante fetch.ts)
  const dbProducts = getProductosAdmin();
  cartItems.forEach(item => {
    const dbProd = dbProducts.find(p => p.id === item.producto.id);
    if (dbProd) {
      dbProd.stock = Math.max(0, dbProd.stock - item.cantidad);
    }
  });
  saveProductos(dbProducts);

  // 4. Vaciar Carrito
  vaciarCarrito();
  actualizarContadorCarrito();

  // 5. Cerrar Modal
  cerrarModalCheckout();

  alert(`¡Pedido #${nuevoPedidoId} confirmado con éxito!\nDirección de envío: ${direccion}\nForma de pago: ${formaPago}`);

  // Redirigir a mis pedidos  
  navigate(ORDER_PAGE);

});

//inicializar
agregarLogout();

contadorCarrito?.addEventListener("click", () => {
  navigate(CART_PAGE);
});

renderizarCarrito();
actualizarContadorCarrito();
guardRoutes();