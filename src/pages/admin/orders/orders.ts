import type { Pedido } from "../../../types/pedido";
import { guardRoutes } from "../../../utils/auth";
import { getPedidos } from "../../../utils/fetch";
import { agregarLogout } from "../../../utils/helpersDom";

let contenedorPedidos: HTMLElement | null = document.querySelector<HTMLElement>("#contenedor-pedidos-admin");
let selectPedidos: HTMLElement | null = document.querySelector<HTMLElement>("#estados-pedidos");

const estadosUnicos = ["TODOS", ...new Set(getPedidos.map(p => p.estado))];

const formatearEstados = (estado: string): string => {
    return estado.replaceAll("_", " ").toLowerCase().replace(/^[a-z]/, (letra) => letra.toUpperCase());
}
const cargarOpcionesPedidos = (): void => {
    if (!selectPedidos) return;

    selectPedidos.innerHTML = "";
    estadosUnicos.forEach(estado => {
        const option = document.createElement("option");
        option.value = estado;
        option.textContent = formatearEstados(estado);
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
    itemPedido.classList.add("pedido-articulo");

    const nroPedido: HTMLHeadingElement = document.createElement("h2");
    nroPedido.classList.add("nro-pedido");
    nroPedido.textContent = "Pedido #: " + pedido.id.toString();

    const clientePedido: HTMLSpanElement = document.createElement("span");
    clientePedido.classList.add("cliente-pedido");
    clientePedido.textContent = `Cliente: ${pedido.usuarioDto.nombre} ${pedido.usuarioDto.apellido}`;

    const fechaPedido: HTMLSpanElement = document.createElement("span");
    fechaPedido.classList.add("fecha-pedido");
    fechaPedido.textContent = `Fecha: ${convertirFecha(pedido.fecha)}`;


    const spanCantidadDetalles: HTMLSpanElement = document.createElement("span");
    spanCantidadDetalles.classList.add("span-cantidad-productos");
    spanCantidadDetalles.textContent = `Cantidad de productos: ${pedido.detalles.length}`;

    const importeTotal: HTMLSpanElement = document.createElement("span");
    importeTotal.classList.add("importe-total");
    importeTotal.textContent = `Total: $${pedido.total.toFixed(2)}`;

    const estadoPedido: HTMLSpanElement = document.createElement("span");
    estadoPedido.classList.add("estado-pedido");
    estadoPedido.textContent = pedido.estado.toUpperCase();

    estadoPedido.classList.add("estado-badge", pedido.estado.toLocaleLowerCase());

    itemPedido.appendChild(nroPedido);
    itemPedido.appendChild(clientePedido);
    itemPedido.appendChild(fechaPedido);
    itemPedido.appendChild(estadoPedido);
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
