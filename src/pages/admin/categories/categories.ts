import { guardRoutes } from "../../../utils/auth";
import { agregarLogout } from "../../../utils/helpersDom";
import { getCategorias } from "../../../utils/localStorage";
import type { ICategoria } from "../../../types/categoria";


const tbodyCategorias = document.querySelector<HTMLTableSectionElement>("#tabla-crud-categorias");
const btnToggleAdmin: HTMLButtonElement | null = document.querySelector<HTMLButtonElement>("#btn-toggle-admin");
const asideAdmin: HTMLElement | null = document.querySelector<HTMLElement>(".admin-layout aside");

const renderizarTablaCategorias = (): void => {
    if (!tbodyCategorias) return;
    tbodyCategorias.innerHTML = "";

    getCategorias().forEach((cat: ICategoria) => {
        if (cat.eliminado) return;
        const fila: HTMLTableRowElement = document.createElement("tr");

        const id: HTMLTableCellElement = document.createElement("td");
        id.textContent = `#${cat.id}`;

        const nombre: HTMLTableCellElement = document.createElement("td");
        nombre.textContent = cat.nombre;

        const descripcion: HTMLTableCellElement = document.createElement("td");
        descripcion.textContent = cat.descripcion;

        fila.appendChild(id);
        fila.appendChild(nombre);
        fila.appendChild(descripcion);

        tbodyCategorias.appendChild(fila);
    });

};

btnToggleAdmin?.addEventListener("click", () => {
    asideAdmin?.classList.toggle("hidden");
});

agregarLogout();
guardRoutes();
renderizarTablaCategorias();