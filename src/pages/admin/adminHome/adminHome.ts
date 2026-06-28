import { guardRoutes } from "../../../utils/auth";
import { getCategorias, getPedidos, getProductos } from "../../../utils/fetch";
import { agregarLogout } from "../../../utils/helpersDom";

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

agregarLogout();
guardRoutes();
calcularTotalCategorias();
calcularTotalProductos();
calcularTotalPedidos();
calcularProductosActivos();