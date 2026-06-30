
import { guardRoutes } from "../../../utils/auth";
import { agregarLogout } from "../../../utils/helpersDom";
import { actualizarContadorCarrito } from "../../store/cart/cart";
import type { Pedido } from "../../../types/pedido";
import type { IUser } from "../../../types/IUser";
import { getUSer, getPedidos, getPedidosByUsuario } from "../../../utils/localStorage";

let contenedorPedidos: HTMLElement | null = document.querySelector<HTMLElement>("#contenedor-pedidos");
let selectPedidos: HTMLElement | null = document.querySelector<HTMLElement>("#estados-pedidos");

const estadosUnicos = ["TODOS", ...new Set(getPedidos().map(p => p.estado))];

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

    const datosUsuario: string | null = getUSer();
    if (!datosUsuario) return;

    const usuario: IUser = JSON.parse(datosUsuario);
    if (!usuario) return;

    const pedidosDeUsuario = getPedidosByUsuario(usuario.email);
    const pedidosFiltrados = estadoFiltro === "TODOS"
        ? pedidosDeUsuario
        : pedidosDeUsuario.filter(p => p.estado.toUpperCase() === estadoFiltro);

    if (pedidosFiltrados.length == 0) {
        contenedorPedidos.innerHTML = "";
        const mensaje: HTMLHeadingElement = document.createElement("h2");
        mensaje.classList.add("no-resultados");
        mensaje.textContent = "No hay pedidos registrados.";
        contenedorPedidos.appendChild(mensaje);
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

    const fechaPedido: HTMLSpanElement = document.createElement("span");
    fechaPedido.classList.add("fecha-pedido");
    fechaPedido.textContent = "📅 - " + convertirFecha(pedido.fecha);

    const nombresProductos = pedido.detalles.map(d => d.producto.nombre);

    const detallesPedidos: HTMLUListElement = document.createElement("ul");
    nombresProductos.forEach(nombre => {
        const elementoPedido = document.createElement("li");
        elementoPedido.textContent = nombre;
        detallesPedidos.appendChild(elementoPedido);
    })

    const spanCantidadDetalles: HTMLSpanElement = document.createElement("span");
    spanCantidadDetalles.classList.add("span-cantidad-productos");
    spanCantidadDetalles.textContent = (nombresProductos != null ? nombresProductos.length.toString() : "0") + " producto(s)";

    const importeTotal: HTMLSpanElement = document.createElement("span");
    importeTotal.classList.add("importe-total");
    importeTotal.textContent = ` Total: $${pedido.total.toFixed(2)}`;

    const estadoPedido: HTMLSpanElement = document.createElement("span");
    estadoPedido.classList.add("estado-pedido");
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