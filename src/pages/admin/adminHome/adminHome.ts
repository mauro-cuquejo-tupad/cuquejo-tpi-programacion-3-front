import { guardRoutes } from "../../../utils/auth";
import { getCategorias, getProductos, getPedidos } from "../../../utils/fetch";
import { agregarLogout } from "../../../utils/helpersDom";
import { navigate } from "../../../utils/navigate";
import { ADMIN_CATEGORIES, ADMIN_ORDERS, ADMIN_PRODUCTS } from "../../../utils/routes";
import type { Product } from "../../../types/product";
import type { Pedido } from "../../../types/pedido";

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
    const categorias = getCategorias();
    totalCategorias.textContent = categorias ? categorias.length.toString() : "0";
};

const calcularTotalProductos = (): void => {
    if (!totalProductos) return;
    const productos = getProductos();
    totalProductos.textContent = productos ? productos.length.toString() : "0";
};

const calcularTotalPedidos = (): void => {
    if (!totalPedidos) return;
    const pedidos = getPedidos();
    totalPedidos.textContent = pedidos ? pedidos.length.toString() : "0";
};

const calcularProductosActivos = (): void => {
    if (!totalProductosActivos) return;
    const productos = getProductos();
    totalProductosActivos.textContent = productos ? productos.filter((p: Product) => p.disponible && !p.eliminado).length.toString() : "0";
};

const calcularTotalIngresos = (): void => {
    if (!totalIngresos) return;
    const pedidos = getPedidos();
    totalIngresos.textContent = pedidos ? "$" + pedidos.reduce((acum: number, p: Pedido) => acum + p.total, 0).toFixed(2) : "$0";
};

const calcularPedidosPendientes = (): void => {
    if (!totalPedidosPendientes) return;
    const pedidos = getPedidos();
    totalPedidosPendientes.textContent = pedidos ? pedidos.filter((p: Pedido) => p.estado === "PENDIENTE").length.toString() : "0";
};

const calcularEnPreparacion = (): void => {
    if (!totalEnPreparacion) return;
    const pedidos = getPedidos();
    totalEnPreparacion.textContent = pedidos ? pedidos.filter((p: Pedido) => p.estado === "EN_PREPARACION").length.toString() : "0";
};

const calcularCompletados = (): void => {
    if (!totalCompletados) return;
    const pedidos = getPedidos();
    totalCompletados.textContent = pedidos ? pedidos.filter((p: Pedido) => p.estado === "ENTREGADO").length.toString() : "0";
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