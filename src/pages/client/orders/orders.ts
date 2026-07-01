
import { guardRoutes, getSessionUser } from "../../../utils/auth";
import { agregarLogout } from "../../../utils/helpersDom";
import { actualizarContadorCarrito } from "../../store/cart/cart";
import type { Pedido } from "../../../types/pedido";


import { getPedidos, getPedidosByUsuario } from "../../../utils/fetch";

let contenedorPedidos: HTMLElement | null = document.querySelector<HTMLElement>("#contenedor-pedidos");
let selectPedidos: HTMLElement | null = document.querySelector<HTMLElement>("#estados-pedidos");

const estadosUnicos: string[] = ["TODOS", ...new Set(getPedidos().map((p: Pedido) => p.estado))];

const formatearEstados = (estado: string): string => {
    return estado.replaceAll("_", " ").toLowerCase().replace(/^[a-z]/, (letra) => letra.toUpperCase());
}

const cargarOpcionesPedidos = (): void => {
    if (!selectPedidos) return;

    selectPedidos.innerHTML = "";
    estadosUnicos.forEach((estado: string) => {
        const option = document.createElement("option");
        option.value = estado;
        option.textContent = formatearEstados(estado);
        selectPedidos.appendChild(option);
    })
};

const renderizarPedidos = (estadoFiltro: string = "TODOS"): void => {
    if (!contenedorPedidos) return;

    const usuario = getSessionUser();
    if (!usuario) return;

    const pedidosDeUsuario = getPedidosByUsuario(usuario.email).sort((a: Pedido, b: Pedido) => b.id - a.id);
    const pedidosFiltrados = estadoFiltro === "TODOS"
        ? pedidosDeUsuario
        : pedidosDeUsuario.filter((p: Pedido) => p.estado.toUpperCase() === estadoFiltro);

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

    itemPedido.style.cursor = "pointer";
    itemPedido.addEventListener("click", () => {
        abrirModalDetalle(pedido);
    });

    return itemPedido;
}

const convertirFecha = (fecha: string): String => {
    const fechaDate: Date = new Date(`${fecha}T12:00:00`);

    return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: 'long',
        year: "numeric"
    }).format(fechaDate);
};

const modalDetalle = document.querySelector<HTMLDivElement>("#detalle-pedido-modal");
const btnCerrarDetalle = document.querySelector<HTMLButtonElement>("#btn-cerrar-detalle");
const btnDetalleCerrarOk = document.querySelector<HTMLButtonElement>("#btn-detalle-cerrar-ok");

const abrirModalDetalle = (pedido: Pedido): void => {
    if (!modalDetalle) return;

    const labelId = document.querySelector<HTMLElement>("#detalle-id");
    if (labelId) labelId.textContent = `Pedido #${pedido.id}`;

    const labelFecha = document.querySelector<HTMLElement>("#detalle-fecha");
    if (labelFecha) labelFecha.textContent = `Fecha: ${convertirFecha(pedido.fecha)}`;

    const badgeEstado = document.querySelector<HTMLSpanElement>("#detalle-estado-badge");
    if (badgeEstado) {
        badgeEstado.textContent = pedido.estado.toUpperCase();
        badgeEstado.className = "estado-badge " + pedido.estado.toLowerCase();
    }

    const labelTel = document.querySelector<HTMLSpanElement>("#detalle-tel");
    if (labelTel) labelTel.textContent = pedido.telefono || pedido.usuarioDto.celular || "No especificado";

    const labelDir = document.querySelector<HTMLSpanElement>("#detalle-dir");
    if (labelDir) labelDir.textContent = pedido.direccion || "Retiro en local";

    const labelPago = document.querySelector<HTMLSpanElement>("#detalle-pago");
    if (labelPago) labelPago.textContent = pedido.formaPago || "No especificada";

    const labelNotas = document.querySelector<HTMLSpanElement>("#detalle-notas");
    if (labelNotas) labelNotas.textContent = pedido.notas || "Sin observaciones";

    const productosLista = document.querySelector<HTMLDivElement>("#detalle-productos-lista");
    if (productosLista) {
        productosLista.innerHTML = "";
        pedido.detalles.forEach(det => {
            const itemRow = document.createElement("div");
            itemRow.style.display = "flex";
            itemRow.style.justifyContent = "space-between";
            itemRow.style.fontSize = "0.95rem";

            const spanNombre = document.createElement("span");
            spanNombre.textContent = `${det.producto.nombre} x${det.cantidad}`;

            const spanPrecio = document.createElement("span");
            spanPrecio.textContent = `$${det.subtotal.toLocaleString('es-ES')}`;

            itemRow.appendChild(spanNombre);
            itemRow.appendChild(spanPrecio);
            productosLista.appendChild(itemRow);
        });
    }

    const subtotal = pedido.total - 500;
    const labelSubtotal = document.querySelector<HTMLSpanElement>("#detalle-subtotal");
    if (labelSubtotal) labelSubtotal.textContent = `$${subtotal.toLocaleString('es-ES')}`;

    const labelTotal = document.querySelector<HTMLSpanElement>("#detalle-total");
    if (labelTotal) labelTotal.textContent = `$${pedido.total.toLocaleString('es-ES')}`;

    modalDetalle.classList.add("activo");
};

const cerrarModalDetalle = (): void => {
    if (modalDetalle) modalDetalle.classList.remove("activo");
};

btnCerrarDetalle?.addEventListener("click", cerrarModalDetalle);
btnDetalleCerrarOk?.addEventListener("click", cerrarModalDetalle);

selectPedidos?.addEventListener("change", (e) => {
    const target = e.target as HTMLSelectElement;
    renderizarPedidos(target.value);
});


agregarLogout();
guardRoutes();
cargarOpcionesPedidos();
renderizarPedidos();
actualizarContadorCarrito();