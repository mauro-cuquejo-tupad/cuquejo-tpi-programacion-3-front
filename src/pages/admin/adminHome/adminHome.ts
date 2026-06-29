import { guardRoutes } from "../../../utils/auth";
import { getCategorias, getPedidos, getProductos } from "../../../utils/fetch";
import { agregarLogout } from "../../../utils/helpersDom";
import { navigate } from "../../../utils/navigate";
import { ADMIN_CATEGORIES, ADMIN_ORDERS, ADMIN_PRODUCTS } from "../../../utils/routes";

const botonGestionarCategorias: HTMLButtonElement | null = document.querySelector<HTMLButtonElement>("#gestionar-categorias");
const botonGestionarProductos: HTMLButtonElement | null = document.querySelector<HTMLButtonElement>("#gestionar-productos");
const botonGestionarPedidos: HTMLButtonElement | null = document.querySelector<HTMLButtonElement>("#gestionar-pedidos");
const btnToggleAdmin: HTMLButtonElement | null = document.querySelector<HTMLButtonElement>("#btn-toggle-admin");
const asideAdmin: HTMLElement | null = document.querySelector<HTMLElement>(".admin-layout aside");

const totalCategorias: HTMLParagraphElement | null = document.querySelector<HTMLParagraphElement>("#total-categorias");
const totalProductos: HTMLParagraphElement | null = document.querySelector<HTMLParagraphElement>("#total-productos");
const totalPedidos: HTMLParagraphElement | null = document.querySelector<HTMLParagraphElement>("#total-pedidos");
const totalProductosActivos: HTMLParagraphElement | null = document.querySelector<HTMLParagraphElement>("#productos-activos");

const totalIngresos: HTMLParagraphElement | null = document.querySelector<HTMLParagraphElement>("#ingresos-totales");
const totalPedidosPendientes: HTMLParagraphElement | null = document.querySelector<HTMLParagraphElement>("#total-pedidos-pendientes");
const totalEnPreparacion: HTMLParagraphElement | null = document.querySelector<HTMLParagraphElement>("#total-en-preparacion");
const totalCompletados: HTMLParagraphElement | null = document.querySelector<HTMLParagraphElement>("#total-completados");



const calcularTotalCategorias = (): void => {
    if (!totalCategorias) return;
    totalCategorias.textContent = getCategorias != null ? getCategorias.length.toString() : "0";
};

const calcularTotalProductos = (): void => {
    if (!totalProductos) return;
    totalProductos.textContent = getProductos != null ? getProductos.length.toString() : "0";
};

const calcularTotalPedidos = (): void => {
    if (!totalPedidos) return;
    totalPedidos.textContent = getPedidos != null ? getPedidos.length.toString() : "0";
};

const calcularProductosActivos = (): void => {
    if (!totalProductosActivos) return;
    totalProductosActivos.textContent = getProductos != null ? getProductos.filter(p => p.disponible && !p.eliminado).length.toString() : "0";
};

const calcularTotalIngresos = (): void => {
    if (!totalIngresos) return;
    totalIngresos.textContent = getPedidos != null ? "$" + getPedidos.reduce((acum, p) => acum + p.total, 0).toFixed(2) : "$0";
};

const calcularPedidosPendientes = (): void => {
    if (!totalPedidosPendientes) return;
    totalPedidosPendientes.textContent = getPedidos != null ? getPedidos.filter(p => p.estado === "PENDIENTE").length.toString() : "0";
};

const calcularEnPreparacion = (): void => {
    if (!totalEnPreparacion) return;
    totalEnPreparacion.textContent = getPedidos != null ? getPedidos.filter(p => p.estado === "EN_PREPARACION").length.toString() : "0";
};

const calcularCompletados = (): void => {
    if (!totalCompletados) return;
    totalCompletados.textContent = getPedidos != null ? getPedidos.filter(p => p.estado === "ENTREGADO").length.toString() : "0";
};

botonGestionarCategorias?.addEventListener("click", () => navigate(ADMIN_CATEGORIES));
botonGestionarPedidos?.addEventListener("click", () => navigate(ADMIN_ORDERS));
botonGestionarProductos?.addEventListener("click", () => navigate(ADMIN_PRODUCTS));

btnToggleAdmin?.addEventListener("click", () => {
    asideAdmin?.classList.toggle("hidden");
});


agregarLogout();
guardRoutes();
calcularTotalCategorias();
calcularTotalProductos();
calcularTotalPedidos();
calcularProductosActivos();
calcularTotalIngresos();
calcularPedidosPendientes();
calcularEnPreparacion();
calcularCompletados();