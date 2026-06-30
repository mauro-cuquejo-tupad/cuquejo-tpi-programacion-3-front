import { guardRoutes } from "../../../utils/auth";
import { agregarLogout, crearBoton } from "../../../utils/helpersDom";
import { getCategorias, getCategoriasAll, saveCategorias } from "../../../utils/fetch";
import type { ICategoria } from "../../../types/categoria";

const tbodyCategorias = document.querySelector<HTMLTableSectionElement>("#tabla-crud-categorias");
const btnToggleAdmin: HTMLButtonElement | null = document.querySelector<HTMLButtonElement>("#btn-toggle-admin");
const asideAdmin: HTMLElement | null = document.querySelector<HTMLElement>(".admin-layout aside");

// Modal Elements
const modalCategoria = document.querySelector<HTMLDivElement>("#categoria-modal");
const formCategoria = document.querySelector<HTMLFormElement>("#form-categoria");
const btnNuevaCategoria = document.querySelector<HTMLButtonElement>("#btn-nueva-categoria");
const btnCerrarModal = document.querySelector<HTMLButtonElement>("#btn-cerrar-modal-categoria");
const btnCancelarModal = document.querySelector<HTMLButtonElement>("#btn-categoria-cancelar");
const modalTitulo = document.querySelector<HTMLHeadingElement>("#modal-categoria-titulo");

const inputIdHidden = document.querySelector<HTMLInputElement>("#categoria-id-hidden");
const inputNombre = document.querySelector<HTMLInputElement>("#categoria-nombre");
const inputDescripcion = document.querySelector<HTMLTextAreaElement>("#categoria-descripcion");

const abrirModal = (categoria?: ICategoria): void => {
    if (!modalCategoria) return;

    if (categoria) {
        if (modalTitulo) modalTitulo.textContent = "Editar Categoría";
        if (inputIdHidden) inputIdHidden.value = categoria.id.toString();
        if (inputNombre) inputNombre.value = categoria.nombre;
        if (inputDescripcion) inputDescripcion.value = categoria.descripcion;
    } else {
        if (modalTitulo) modalTitulo.textContent = "Nueva Categoría";
        if (inputIdHidden) inputIdHidden.value = "";
        formCategoria?.reset();
    }

    modalCategoria.classList.add("activo");
};

const cerrarModal = (): void => {
    if (modalCategoria) modalCategoria.classList.remove("activo");
    formCategoria?.reset();
};

const eliminarCategoria = (id: number): void => {
    const categorias = getCategoriasAll();
    const categoria = categorias.find(c => c.id === id);

    if (categoria) {
        if (confirm(`¿Está seguro de que desea eliminar la categoría "${categoria.nombre}"?`)) {
            categoria.eliminado = true;
            saveCategorias(categorias);
            renderizarTablaCategorias();
        }
    }
};

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

        // Acciones
        const acciones: HTMLTableCellElement = document.createElement("td");
        acciones.style.display = "flex";
        acciones.style.gap = "0.5rem";

        const btnEditar = crearBoton(`btn-edit-${cat.id}`, "btn-comprar", "Editar");
        btnEditar.style.padding = "0.4rem 0.8rem";
        btnEditar.style.fontSize = "0.9rem";
        btnEditar.addEventListener("click", () => abrirModal(cat));

        const btnEliminar = crearBoton(`btn-del-${cat.id}`, "btn-borrar", "Eliminar");
        btnEliminar.style.padding = "0.4rem 0.8rem";
        btnEliminar.style.fontSize = "0.9rem";
        btnEliminar.addEventListener("click", () => eliminarCategoria(cat.id));

        acciones.appendChild(btnEditar);
        acciones.appendChild(btnEliminar);

        fila.appendChild(id);
        fila.appendChild(nombre);
        fila.appendChild(descripcion);
        fila.appendChild(acciones);

        tbodyCategorias.appendChild(fila);
    });
};

btnToggleAdmin?.addEventListener("click", () => {
    asideAdmin?.classList.toggle("hidden");
});

btnNuevaCategoria?.addEventListener("click", () => abrirModal());
btnCerrarModal?.addEventListener("click", cerrarModal);
btnCancelarModal?.addEventListener("click", cerrarModal);

formCategoria?.addEventListener("submit", (e: SubmitEvent) => {
    e.preventDefault();

    const idStr = inputIdHidden?.value;
    const nombreVal = inputNombre?.value.trim() || "";
    const descripcionVal = inputDescripcion?.value.trim() || "";

    if (!nombreVal || !descripcionVal) {
        alert("Por favor complete todos los campos.");
        return;
    }

    const categorias = getCategoriasAll();

    if (idStr) {
        // Modo Edición
        const idNum = Number(idStr);
        const cat = categorias.find(c => c.id === idNum);
        if (cat) {
            cat.nombre = nombreVal;
            cat.descripcion = descripcionVal;
        }
    } else {
        // Modo Creación
        const nuevaCat: ICategoria = {
            id: Date.now(),
            nombre: nombreVal,
            descripcion: descripcionVal,
            eliminado: false,
            createdAt: new Date().toISOString()
        };
        categorias.push(nuevaCat);
    }

    saveCategorias(categorias);
    cerrarModal();
    renderizarTablaCategorias();
});

agregarLogout();
guardRoutes();
renderizarTablaCategorias();