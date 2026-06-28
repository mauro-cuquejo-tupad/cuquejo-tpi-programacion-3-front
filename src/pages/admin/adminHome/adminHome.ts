import { guardRoutes } from "../../../utils/auth";
import { getCategorias, getPedidos, getProductos } from "../../../utils/fetch";
import { agregarLogout } from "../../../utils/helpersDom";
import { navigate } from "../../../utils/navigate";
import { ADMIN_CATEGORIES, ADMIN_ORDERS, ADMIN_PRODUCTS } from "../../../utils/routes";

let botonGestionarCategorias: HTMLButtonElement | null = document.querySelector<HTMLButtonElement>("#gestionar-categorias");
let botonGestionarProductos: HTMLButtonElement | null = document.querySelector<HTMLButtonElement>("#gestionar-productos");
let botonGestionarPedidos: HTMLButtonElement | null = document.querySelector<HTMLButtonElement>("#gestionar-pedidos");

let totalCategorias: HTMLParagraphElement | null = document.querySelector<HTMLParagraphElement>("#total-categorias");
let totalProductos: HTMLParagraphElement | null = document.querySelector<HTMLParagraphElement>("#total-productos");
let totalPedidos: HTMLParagraphElement | null = document.querySelector<HTMLParagraphElement>("#total-pedidos");
let totalProductosActivos: HTMLParagraphElement | null = document.querySelector<HTMLParagraphElement>("#productos-activos");

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

botonGestionarCategorias?.addEventListener("click", () => navigate(ADMIN_CATEGORIES));
botonGestionarPedidos?.addEventListener("click", () => navigate(ADMIN_ORDERS));
botonGestionarProductos?.addEventListener("click", () => navigate(ADMIN_PRODUCTS));


agregarLogout();
guardRoutes();
calcularTotalCategorias();
calcularTotalProductos();
calcularTotalPedidos();
calcularProductosActivos();