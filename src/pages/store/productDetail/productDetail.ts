import type { Product } from "../../../types/product";
import { guardRoutes } from "../../../utils/auth";
import { getProductos } from "../../../utils/fetch";
import { agregarLogout, crearBoton } from "../../../utils/helpersDom";
import { navigate } from "../../../utils/navigate";
import { CART_PAGE, HOME_STORE } from "../../../utils/routes";
import { agregarAlCarrito, getCantidadEnCarrito } from "../cart/cart";

const contenedorProductos: HTMLElement | null = document.querySelector<HTMLElement>("#contenedor-producto");

const cargarProductos = (): void => {
    if (!contenedorProductos) return;

    contenedorProductos.innerHTML = "";
    const id: number = Number(new URLSearchParams(window.location.search).get("id"));
    const origen: string = String(new URLSearchParams(window.location.search).get("origen") || "home");

    if (!id) {
        const mensaje: HTMLHeadingElement = document.createElement("h2");
        mensaje.classList.add("no-resultados");
        mensaje.textContent = "No se encontró el producto.";
        contenedorProductos.appendChild(mensaje);
        return;
    }

    getProductos().filter((p: Product) => {
        if (!p.eliminado && p.id === id) contenedorProductos.appendChild(crearArticuloProducto(p, origen));
    });
};

const crearArticuloProducto = (producto: Product, origen: string): HTMLElement => {
    const articulo: HTMLElement = document.createElement("article");
    articulo.className = "producto-articulo-detalle";
    articulo.id = `articulo-${producto.id}`;

    const imagenDiv: HTMLDivElement = document.createElement("div");
    imagenDiv.id = "producto-div-imagen";

    const titulo: HTMLHeadElement = document.createElement("h3");
    titulo.textContent = producto.nombre;

    const imagen: HTMLImageElement = document.createElement("img");
    imagen.src = `${producto.imagen}`;
    imagen.alt = producto.nombre;

    imagenDiv.appendChild(imagen);

    const descripcionDiv: HTMLDivElement = document.createElement("div");
    descripcionDiv.id = "producto-div-descripcion";

    const stockDisponible: number = producto.stock - getCantidadEnCarrito(producto);

    const stock: HTMLParagraphElement = document.createElement("p");
    stock.textContent = "Stock: " + stockDisponible;
    const descripcion: HTMLParagraphElement = document.createElement("p");
    descripcion.textContent = producto.descripcion;

    const precio: HTMLSpanElement = document.createElement("span");
    precio.classList.add("precio");
    precio.textContent = '$' + producto.precio + ' c/u';

    let divModificarCantidad: HTMLDivElement = document.createElement("div");
    divModificarCantidad.classList.add("modificar-cantidad");
    let divAgregarOQuitarProductos: HTMLDivElement = document.createElement("div");

    const cantidad: HTMLInputElement = document.createElement("input");
    cantidad.type = "text";
    cantidad.classList.add("cantidad-carrito");
    cantidad.value = "0";

    const botonEliminar: HTMLButtonElement = crearBoton("btn-eliminar-" + producto.id, "btn-accion", `-`);

    const botonAgregar: HTMLButtonElement = crearBoton("btn-agregar-" + producto.id, "btn-accion", `+`);

    const botonAgregarAlCarrito: HTMLButtonElement = crearBoton("btn-agregar-carrito-" + producto.id, "btn-accion", `Agregar al Carrito`);

    let ultimoValorValido: string = cantidad.value;

    const actualizarBotones = (): void => {
        const valor = Number(cantidad.value);

        cantidad.disabled = producto.disponible === false || stockDisponible == 0;
        botonEliminar.disabled = valor <= 0 || producto.disponible === false;
        botonAgregar.disabled = valor >= stockDisponible || producto.disponible === false;
        botonAgregarAlCarrito.disabled = botonEliminar.disabled === true;

        cantidad.classList.toggle(
            "boton-deshabilitado",
            cantidad.disabled
        );

        botonEliminar.classList.toggle(
            "boton-deshabilitado",
            botonEliminar.disabled
        );

        botonAgregar.classList.toggle(
            "boton-deshabilitado",
            botonAgregar.disabled
        );

        botonAgregarAlCarrito.classList.toggle(
            "boton-deshabilitado",
            botonAgregarAlCarrito.disabled
        );
    };

    botonAgregar.addEventListener("click", (): void => {
        const valorActual: number = Number(cantidad.value);

        if (valorActual < stockDisponible) {
            cantidad.value = String(valorActual + 1);
            ultimoValorValido = cantidad.value;
            actualizarBotones();
        }
    });

    botonEliminar.addEventListener("click", (): void => {
        const valorActual: number = Number(cantidad.value);

        if (valorActual > 0) {
            cantidad.value = String(valorActual - 1);
            ultimoValorValido = cantidad.value;
            actualizarBotones();
        }
    });

    botonAgregarAlCarrito.addEventListener("click", (): void => {
        agregarAlCarrito(producto.id, Number(cantidad.value));
        alert("Producto agregado correctamente");
        navigate(origen === "home" ? HOME_STORE : CART_PAGE);
        return;
    });

    cantidad.addEventListener("input", (e: Event) => {
        const input: HTMLInputElement = e.target as HTMLInputElement;

        if (!/^\d*$/.test(input.value)) {
            input.value = ultimoValorValido;
            return;
        }

        let valor = Number(input.value || 0);

        if (valor > stockDisponible) {
            valor = stockDisponible;
        }

        if (valor < 0) {
            valor = 0;
        }

        input.value = String(valor);
        ultimoValorValido = input.value;

        actualizarBotones();
    });

    actualizarBotones();

    divAgregarOQuitarProductos.appendChild(botonEliminar);
    divAgregarOQuitarProductos.appendChild(cantidad);
    divAgregarOQuitarProductos.appendChild(botonAgregar);

    divModificarCantidad.appendChild(divAgregarOQuitarProductos);

    const botonVolver: HTMLButtonElement = crearBoton("btn-volver", "btn-volver", "⬅ Volver a " + origen);

    botonVolver.addEventListener("click", () => {
        navigate(origen === "home" ? HOME_STORE : CART_PAGE);
    });

    descripcionDiv.appendChild(titulo);

    descripcionDiv.appendChild(stock);
    descripcionDiv.appendChild(descripcion);
    descripcionDiv.appendChild(precio);
    descripcionDiv.appendChild(divModificarCantidad);
    descripcionDiv.appendChild(botonAgregarAlCarrito);
    descripcionDiv.appendChild(botonVolver);

    articulo.appendChild(imagenDiv);
    articulo.appendChild(descripcionDiv);
    return articulo;
};

agregarLogout();
guardRoutes();
cargarProductos();