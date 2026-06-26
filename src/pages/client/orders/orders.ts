import { getPedidos } from "../../../utils/fetch";
import { guardRoutes } from "../../../utils/auth";
import { agregarLogout } from "../../../utils/helpersDom";
import { actualizarContadorCarrito } from "../../store/cart/cart";
import type { Pedido } from "../../../types/pedido";

let contenedorPedidos: HTMLElement | null = document.querySelector<HTMLElement>("#contenedor-pedidos");
let selectPedidos: HTMLElement | null = document.querySelector<HTMLElement>("#estados-pedidos");

const cargarOpcionesPedidos = (): void => {
    if (!selectPedidos) return;

    const estadosUnicos = ["TODOS", ...new Set(getPedidos.map(p => p.estado.toUpperCase()))];

    selectPedidos.innerHTML = "";
    estadosUnicos.forEach(estado => {
        const option = document.createElement("option");
        option.value = estado;
        option.textContent = estado;
        selectPedidos.appendChild(option);
    })
};

const renderizarPedidos = (estadoFiltro: string = "TODOS"): void => {
    if (!contenedorPedidos) return;


    const pedidosFiltrados = estadoFiltro === "TODOS"
        ? getPedidos
        : getPedidos.filter(p => p.estado.toUpperCase() === estadoFiltro);

    if (pedidosFiltrados.length == 0) {
        contenedorPedidos.innerHTML = "No hay pedidos registrados.</p>";
        return;
    };

    contenedorPedidos.innerHTML = "";

    pedidosFiltrados.forEach((pedido: Pedido) => {
        contenedorPedidos.appendChild(crearItemPedido(pedido));
    })

};

const crearItemPedido = (pedido: Pedido): HTMLDivElement => {
    const itemPedido: HTMLDivElement = document.createElement("div");
    itemPedido.id = pedido.id.toString();
    itemPedido.classList.add("producto-articulo");

    const fechaPedido: HTMLSpanElement = document.createElement("span");
    fechaPedido.textContent = "📅 - " + convertirFecha(pedido.fecha);

    const nombresProductos = pedido.detalles.map(d => d.producto.nombre);

    const detallesPedidos: HTMLUListElement = document.createElement("ul");
    nombresProductos.forEach(nombre => {
        const elementoPedido = document.createElement("li");
        elementoPedido.textContent = nombre;
        detallesPedidos.appendChild(elementoPedido);
    })

    const spanCantidadDetalles: HTMLSpanElement = document.createElement("span");
    spanCantidadDetalles.textContent = (nombresProductos != null ? nombresProductos.length.toString() : "0") + " producto(s)";

    const importeTotal: HTMLSpanElement = document.createElement("span");
    importeTotal.textContent = ` Total: $${pedido.total.toFixed(2)}`;

    const estadoPedido: HTMLSpanElement = document.createElement("span");
    estadoPedido.textContent = pedido.estado.toUpperCase();

    estadoPedido.classList.add("estado-badge", pedido.estado.toLocaleLowerCase());

    itemPedido.appendChild(fechaPedido);
    itemPedido.appendChild(estadoPedido);
    itemPedido.appendChild(detallesPedidos);
    itemPedido.appendChild(spanCantidadDetalles);
    itemPedido.appendChild(importeTotal);

    return itemPedido;
};

const convertirFecha = (fecha: string): String => {
    const fechaDate: Date = new Date(`${fecha}T12:00:00`);

    return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: 'long',
        year: "numeric"
    }).format(fechaDate);
};

selectPedidos?.addEventListener("change", (e) => {
    const target = e.target as HTMLSelectElement;
    renderizarPedidos(target.value);
});


agregarLogout();
guardRoutes();
cargarOpcionesPedidos();
renderizarPedidos();
actualizarContadorCarrito();