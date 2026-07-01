import type { Pedido } from "../../../types/pedido";
import { guardRoutes } from "../../../utils/auth";
import { getPedidos, getPedidosByEstado, savePedidos } from "../../../utils/fetch";
import { agregarLogout } from "../../../utils/helpersDom";
import type { Estados } from "../../../types/estados";

let contenedorPedidos: HTMLElement | null = document.querySelector<HTMLElement>("#contenedor-pedidos-admin");
let selectPedidos: HTMLSelectElement | null = document.querySelector<HTMLSelectElement>("#estados-pedidos");
const btnToggleAdmin: HTMLButtonElement | null = document.querySelector<HTMLButtonElement>("#btn-toggle-admin");
const asideAdmin: HTMLElement | null = document.querySelector<HTMLElement>(".admin-layout aside");

const modalAdminDetalle = document.querySelector<HTMLDivElement>("#admin-detalle-pedido-modal");
const formAdminPedido = document.querySelector<HTMLFormElement>("#form-admin-pedido");
const btnCerrarAdminDetalle = document.querySelector<HTMLButtonElement>("#btn-cerrar-admin-detalle");
const btnCancelarAdminDetalle = document.querySelector<HTMLButtonElement>("#btn-admin-detalle-cancelar");

const inputIdHidden = document.querySelector<HTMLInputElement>("#admin-detalle-id-hidden");
const labelId = document.querySelector<HTMLElement>("#admin-detalle-id");
const labelFecha = document.querySelector<HTMLElement>("#admin-detalle-fecha");
const labelEmail = document.querySelector<HTMLSpanElement>("#admin-detalle-email");
const labelTel = document.querySelector<HTMLSpanElement>("#admin-detalle-tel");
const labelDir = document.querySelector<HTMLSpanElement>("#admin-detalle-dir");
const labelPago = document.querySelector<HTMLSpanElement>("#admin-detalle-pago");
const labelNotas = document.querySelector<HTMLSpanElement>("#admin-detalle-notes");
const selectEstado = document.querySelector<HTMLSelectElement>("#admin-pedido-estado");
const productosLista = document.querySelector<HTMLDivElement>("#admin-detalle-productos-lista");
const labelSubtotal = document.querySelector<HTMLSpanElement>("#admin-detalle-subtotal");
const labelTotal = document.querySelector<HTMLSpanElement>("#admin-detalle-total");

const estadosUnicos: string[] = ["TODOS", ...new Set(getPedidos().map((p: Pedido) => p.estado))];

const formatearEstados = (estado: string): string => {
    return estado.replaceAll("_", " ").toLowerCase().replace(/^[a-z]/, (letra) => letra.toUpperCase());
};

const cargarOpcionesPedidos = (): void => {
    if (!selectPedidos) return;

    selectPedidos.innerHTML = "";
    estadosUnicos.forEach((estado: string) => {
        const option = document.createElement("option");
        option.value = estado;
        option.textContent = formatearEstados(estado);
        selectPedidos.appendChild(option);
    });
};

const renderizarPedidos = (estadoFiltro: string = "TODOS"): void => {
    if (!contenedorPedidos) return;

    const pedidosFiltrados = getPedidosByEstado(estadoFiltro).sort((a: Pedido, b: Pedido) => b.id - a.id);

    if (pedidosFiltrados.length == 0) {
        contenedorPedidos.innerHTML = "<p class='no-resultados'>No hay pedidos registrados.</p>";
        return;
    }

    contenedorPedidos.innerHTML = "";

    pedidosFiltrados.forEach((pedido: Pedido) => {
        contenedorPedidos.appendChild(crearItemPedido(pedido));
    });
};

const abrirModalAdminDetalle = (pedido: Pedido): void => {
    if (!modalAdminDetalle) return;

    if (inputIdHidden) inputIdHidden.value = pedido.id.toString();
    if (labelId) labelId.textContent = `Pedido #${pedido.id}`;
    if (labelFecha) labelFecha.textContent = `Fecha: ${convertirFecha(pedido.fecha)}`;
    if (labelEmail) labelEmail.textContent = pedido.usuarioDto.mail;
    if (labelTel) labelTel.textContent = pedido.telefono || pedido.usuarioDto.celular || "No especificado";
    if (labelDir) labelDir.textContent = pedido.direccion || "Retiro en local";
    if (labelPago) labelPago.textContent = pedido.formaPago || "No especificada";
    if (labelNotas) labelNotas.textContent = pedido.notas || "Sin observaciones";
    if (selectEstado) selectEstado.value = pedido.estado;

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
    if (labelSubtotal) labelSubtotal.textContent = `$${subtotal.toLocaleString('es-ES')}`;
    if (labelTotal) labelTotal.textContent = `$${pedido.total.toLocaleString('es-ES')}`;

    modalAdminDetalle.classList.add("activo");
};

const cerrarModalAdminDetalle = (): void => {
    if (modalAdminDetalle) modalAdminDetalle.classList.remove("activo");
    formAdminPedido?.reset();
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

    itemPedido.style.cursor = "pointer";
    itemPedido.addEventListener("click", () => {
        abrirModalAdminDetalle(pedido);
    });

    return itemPedido;
};

const convertirFecha = (fecha: string): string => {
    const fechaDate: Date = new Date(`${fecha}T12:00:00`);
    return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: 'long',
        year: "numeric"
    }).format(fechaDate);
};

btnCerrarAdminDetalle?.addEventListener("click", cerrarModalAdminDetalle);
btnCancelarAdminDetalle?.addEventListener("click", cerrarModalAdminDetalle);

selectPedidos?.addEventListener("change", (e) => {
    const target = e.target as HTMLSelectElement;
    renderizarPedidos(target.value);
});

btnToggleAdmin?.addEventListener("click", () => {
    asideAdmin?.classList.toggle("hidden");
});

formAdminPedido?.addEventListener("submit", (e: SubmitEvent) => {
    e.preventDefault();

    const idStr = inputIdHidden?.value;
    const estadoVal = selectEstado?.value as Estados;

    if (!idStr || !estadoVal) return;

    const idNum = Number(idStr);
    const pedidos = getPedidos();
    const pedido = pedidos.find(p => p.id === idNum);

    if (pedido) {
        pedido.estado = estadoVal;
        savePedidos(pedidos);
        cerrarModalAdminDetalle();
        
        const filtroActual = selectPedidos?.value || "TODOS";
        renderizarPedidos(filtroActual);
    }
});

agregarLogout();
guardRoutes();
cargarOpcionesPedidos();
renderizarPedidos();
