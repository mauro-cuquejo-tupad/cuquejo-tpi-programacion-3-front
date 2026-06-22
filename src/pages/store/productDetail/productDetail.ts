import type { Product } from "../../../types/product";
import { agregarLogout, guardRoutes } from "../../../utils/auth";
import { getProductos } from "../../../utils/fetch";
import { crearBoton } from "../../../utils/helpersDom";
import { navigate } from "../../../utils/navigate";
import { HOME_STORE } from "../../../utils/routes";
import { actualizarContadorCarrito, agregarAlCarrito, eliminarDelCarrito, getCantidadEnCarrito } from "../cart/cart";

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
    stock.textContent = "Stock: " + (producto.stock - getCantidadEnCarrito(producto));
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
        if(producto.stock - getCantidadEnCarrito(producto) > 0) {
            agregarAlCarrito(producto.id);
            actualizarContadorCarrito();
            renderizarBotonProductoAgregado(botonAgregar);
            cargarProductos();
        }
    });

    let divModificarCantidad: HTMLDivElement = document.createElement("div");
      divModificarCantidad.classList.add("modificar-cantidad");
      let divAgregarOQuitarProductos: HTMLDivElement = document.createElement("div");
      const botonEliminar: HTMLButtonElement = crearBoton("btn-eliminar-" + producto.id, "btn-accion", `-`);
      botonEliminar.addEventListener("click", () => {
        if(getCantidadEnCarrito(producto) > 0) {
            eliminarDelCarrito(producto.id);
            actualizarContadorCarrito();
            renderizarBotonProductoAgregado(botonAgregar);
            cargarProductos();
        }
      });

      const cantidad: HTMLSpanElement = document.createElement("span");
      cantidad.classList.add("cantidad-carrito");
      cantidad.textContent = getCantidadEnCarrito(producto).toString();

      const botonAgregar2: HTMLButtonElement = crearBoton("btn-agregar-" + producto.id, "btn-accion", `+`);
        botonAgregar2.addEventListener("click", () => {
          if(producto.stock - getCantidadEnCarrito(producto) > 0) {
            agregarAlCarrito(producto.id);
            actualizarContadorCarrito();
            renderizarBotonProductoAgregado(botonAgregar);
            cargarProductos();
        }
        });

        divAgregarOQuitarProductos.appendChild(botonEliminar);
        divAgregarOQuitarProductos.appendChild(cantidad);
        divAgregarOQuitarProductos.appendChild(botonAgregar2);

        divModificarCantidad.appendChild(divAgregarOQuitarProductos);


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
    descripcionDiv.appendChild(divModificarCantidad);
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

agregarLogout();
guardRoutes();
cargarProductos();