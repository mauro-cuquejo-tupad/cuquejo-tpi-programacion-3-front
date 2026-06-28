import { guardRoutes } from "../../../utils/auth";
import { agregarLogout } from "../../../utils/helpersDom";
import { getProductos } from "../../../utils/fetch";
import type { Product } from "../../../types/product";

const tbodyProductos = document.querySelector<HTMLTableSectionElement>("#tabla-crud-productos");

const renderizarTablaProductos = (): void => {
    if (!tbodyProductos) return;
    tbodyProductos.innerHTML = "";

    getProductos.forEach((prod: Product) => {
        if (prod.eliminado) return; // Borrado lógico

        const fila: HTMLTableRowElement = document.createElement("tr");

        const imagen: HTMLImageElement = document.createElement("img");
        imagen.src = prod.imagen;
        imagen.alt = prod.nombre;
        imagen.style.width = "50px";
        imagen.style.height = "50px";
        imagen.style.objectFit = "cover";
        imagen.style.borderRadius = "4px";

        const nombre: HTMLTableCellElement = document.createElement("td");
        nombre.textContent = prod.nombre;

        const descripcion: HTMLTableCellElement = document.createElement("td");
        descripcion.textContent = prod.descripcion;

        const categoria: HTMLTableCellElement = document.createElement("td");
        categoria.textContent = prod.categoria?.nombre || "Sin categoría";

        const precio: HTMLTableCellElement = document.createElement("td");
        precio.textContent = "$" + prod.precio.toFixed(2);

        const stock: HTMLTableCellElement = document.createElement("td");
        stock.textContent = prod.stock + " u.";

        const estado: HTMLTableCellElement = document.createElement("td");
        estado.textContent = prod.disponible ? "Disponible" : "No Disponible";

        fila.appendChild(imagen);
        fila.appendChild(nombre);
        fila.appendChild(descripcion);
        fila.appendChild(categoria);
        fila.appendChild(precio);
        fila.appendChild(stock);
        fila.appendChild(estado);

        tbodyProductos.appendChild(fila);
    });


};

agregarLogout();
guardRoutes();
renderizarTablaProductos();
