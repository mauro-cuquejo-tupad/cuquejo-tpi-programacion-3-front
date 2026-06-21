import type { Product } from "../../../types/product";
import { agregarLogout, guardRoutes } from "../../../utils/auth";
import { getProductos } from "../../../utils/fetch";
import { navigate } from "../../../utils/navigate";
import { HOME_STORE } from "../../../utils/routes";
import { actualizarContadorCarrito, agregarAlCarrito } from "../cart/cart";

const contenedorProductos : HTMLElement | null = document.querySelector<HTMLElement>("#contenedor-producto");

const cargarProductos = () : void => {
  if (!contenedorProductos) return;

  contenedorProductos.innerHTML = "";
  const id = Number(new URLSearchParams(window.location.search).get("id"));
  if(!id) {
    const mensaje: HTMLHeadingElement = document.createElement("h2");
    mensaje.classList.add("no-resultados");
    mensaje.textContent = "No se encontró el producto.";
    contenedorProductos.appendChild(mensaje);
    return;
  }

  getProductos.filter((p: Product) => {
    if(!p.eliminado && p.id === id) contenedorProductos.appendChild(crearArticuloProducto(p));
  });
};

const crearArticuloProducto = (producto: Product) :HTMLElement => {
    const articulo: HTMLElement = document.createElement("article");
    articulo.className = "producto-articulo-detalle";
    articulo.id = `articulo-${producto.id}`;

    const imagenDiv: HTMLDivElement = document.createElement("div");
    imagenDiv.id = "producto-div-imagen";

    const titulo:HTMLHeadElement = document.createElement("h3");
    titulo.textContent = producto.nombre;

    const imagen: HTMLImageElement = document.createElement("img");
    imagen.src = `${producto.imagen}`;
    imagen.alt = producto.nombre;

    imagenDiv.appendChild(imagen);

    const descripcionDiv: HTMLDivElement = document.createElement("div");
    descripcionDiv.id = "producto-div-descripcion";

    const stock: HTMLParagraphElement = document.createElement("p");
    stock.textContent = "Stock:";
    const descripcion: HTMLParagraphElement = document.createElement("p");
    descripcion.textContent = producto.descripcion;

    const precio: HTMLSpanElement = document.createElement("span");
    precio.classList.add("precio");
    precio.textContent = '$' + producto.precio;

    const botonAgregar: HTMLButtonElement = document.createElement("button");
    botonAgregar.id = "btn-agregar-" + producto.id;
    botonAgregar.type = "button";
    botonAgregar.className = "btn-agregar";
    botonAgregar.textContent = "Agregar al carrito";
    botonAgregar.addEventListener("click", () => {
      agregarAlCarrito(producto.id);
      actualizarContadorCarrito();
      renderizarBotonProductoAgregado(botonAgregar);
    });

    const botonVolver: HTMLButtonElement = document.createElement("button");
    botonVolver.id = "btn-volver";
    botonVolver.type = "button";
    botonVolver.className = "btn-volver";
    botonVolver.textContent = "⬅ Volver";
    botonVolver.addEventListener("click", () => {
    navigate(HOME_STORE);
    });

    descripcionDiv.appendChild(titulo);

    descripcionDiv.appendChild(stock);
    descripcionDiv.appendChild(descripcion);
    descripcionDiv.appendChild(precio);
    descripcionDiv.appendChild(botonAgregar);
    descripcionDiv.appendChild(botonVolver);

    articulo.appendChild(imagenDiv);
    articulo.appendChild(descripcionDiv);
    return articulo;
};

const renderizarBotonProductoAgregado = (boton: HTMLButtonElement) : void => {
  boton.textContent = "✓ Agregado";
  boton.disabled = true;
  boton.classList.add("agregado");
  setTimeout(() => {
    boton.textContent = "Agregar al carrito";
    boton.disabled = false;
    boton.classList.remove("agregado");
  }, 1000);
};

const getStockDisponible = () : number => {
    return 0;
}

agregarLogout();
guardRoutes();
cargarProductos();