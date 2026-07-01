import { guardRoutes } from "../../../utils/auth";
import { agregarLogout, crearBoton } from "../../../utils/helpersDom";
import { getProductosAdmin, saveProductos, getCategorias } from "../../../utils/fetch";
import type { Product } from "../../../types/product";
import type { ICategoria } from "../../../types/categoria";

const tbodyProductos = document.querySelector<HTMLTableSectionElement>("#tabla-crud-productos");
const btnToggleAdmin: HTMLButtonElement | null = document.querySelector<HTMLButtonElement>("#btn-toggle-admin");
const asideAdmin: HTMLElement | null = document.querySelector<HTMLElement>(".admin-layout aside");

const modalProducto = document.querySelector<HTMLDivElement>("#producto-modal");
const formProducto = document.querySelector<HTMLFormElement>("#form-producto");
const btnNuevoProducto = document.querySelector<HTMLButtonElement>("#btn-nuevo-producto");
const btnCerrarModal = document.querySelector<HTMLButtonElement>("#btn-cerrar-modal-producto");
const btnCancelarModal = document.querySelector<HTMLButtonElement>("#btn-producto-cancelar");
const modalTitulo = document.querySelector<HTMLHeadingElement>("#modal-producto-titulo");

const inputIdHidden = document.querySelector<HTMLInputElement>("#producto-id-hidden");
const inputNombre = document.querySelector<HTMLInputElement>("#producto-nombre");
const inputDescripcion = document.querySelector<HTMLTextAreaElement>("#producto-descripcion");
const inputPrecio = document.querySelector<HTMLInputElement>("#producto-precio");
const inputStock = document.querySelector<HTMLInputElement>("#producto-stock");
const selectCategoria = document.querySelector<HTMLSelectElement>("#producto-categoria");
const inputImagen = document.querySelector<HTMLInputElement>("#producto-imagen");
const checkboxDisponible = document.querySelector<HTMLInputElement>("#producto-disponible");

const popularCategorias = (): void => {
    if (!selectCategoria) return;

    const selectedVal = selectCategoria.value;

    selectCategoria.innerHTML = `<option value="" disabled selected>Seleccione una categoría</option>`;
    getCategorias().forEach((cat: ICategoria) => {
        const opt = document.createElement("option");
        opt.value = cat.id.toString();
        opt.textContent = cat.nombre;
        selectCategoria.appendChild(opt);
    });

    if (selectedVal) {
        selectCategoria.value = selectedVal;
    }
};

const abrirModal = (prod?: Product): void => {
    if (!modalProducto) return;

    popularCategorias();

    if (prod) {
        if (modalTitulo) modalTitulo.textContent = "Editar Producto";
        if (inputIdHidden) inputIdHidden.value = prod.id.toString();
        if (inputNombre) inputNombre.value = prod.nombre;
        if (inputDescripcion) inputDescripcion.value = prod.descripcion;
        if (inputPrecio) inputPrecio.value = prod.precio.toString();
        if (inputStock) inputStock.value = prod.stock.toString();
        if (selectCategoria && prod.categoria) selectCategoria.value = prod.categoria.id.toString();
        if (inputImagen) inputImagen.value = prod.imagen;
        if (checkboxDisponible) checkboxDisponible.checked = prod.disponible;
    } else {
        if (modalTitulo) modalTitulo.textContent = "Nuevo Producto";
        if (inputIdHidden) inputIdHidden.value = "";
        formProducto?.reset();
    }

    modalProducto.classList.add("activo");
};

const cerrarModal = (): void => {
    if (modalProducto) modalProducto.classList.remove("activo");
    formProducto?.reset();
};

const eliminarProducto = (id: number): void => {
    const productos = getProductosAdmin();
    const prod = productos.find(p => p.id === id);

    if (prod) {
        if (confirm(`¿Está seguro de que desea eliminar el producto "${prod.nombre}"?`)) {
            prod.eliminado = true;
            saveProductos(productos);
            renderizarTablaProductos();
        }
    }
};

const renderizarTablaProductos = (): void => {
    if (!tbodyProductos) return;
    tbodyProductos.innerHTML = "";

    getProductosAdmin().forEach((prod: Product) => {
        if (prod.eliminado) return;

        const fila: HTMLTableRowElement = document.createElement("tr");

        const imagen: HTMLImageElement = document.createElement("img");
        imagen.src = prod.imagen;
        imagen.alt = prod.nombre;

        const tdImagen: HTMLTableCellElement = document.createElement("td");
        tdImagen.appendChild(imagen);

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

        const acciones: HTMLTableCellElement = document.createElement("td");
        acciones.style.display = "flex";
        acciones.style.gap = "0.5rem";

        const btnEditar = crearBoton(`btn-edit-${prod.id}`, "btn-comprar", "Editar");
        btnEditar.style.padding = "0.4rem 0.8rem";
        btnEditar.style.fontSize = "0.9rem";
        btnEditar.addEventListener("click", () => abrirModal(prod));

        const btnEliminar = crearBoton(`btn-del-${prod.id}`, "btn-borrar", "Eliminar");
        btnEliminar.style.padding = "0.4rem 0.8rem";
        btnEliminar.style.fontSize = "0.9rem";
        btnEliminar.addEventListener("click", () => eliminarProducto(prod.id));

        acciones.appendChild(btnEditar);
        acciones.appendChild(btnEliminar);

        fila.appendChild(tdImagen);
        fila.appendChild(nombre);
        fila.appendChild(descripcion);
        fila.appendChild(categoria);
        fila.appendChild(precio);
        fila.appendChild(stock);
        fila.appendChild(estado);
        fila.appendChild(acciones);

        tbodyProductos.appendChild(fila);
    });
};

btnToggleAdmin?.addEventListener("click", () => {
    asideAdmin?.classList.toggle("hidden");
});

btnNuevoProducto?.addEventListener("click", () => abrirModal());
btnCerrarModal?.addEventListener("click", cerrarModal);
btnCancelarModal?.addEventListener("click", cerrarModal);

formProducto?.addEventListener("submit", (e: SubmitEvent) => {
    e.preventDefault();

    const idStr = inputIdHidden?.value;
    const nombreVal = inputNombre?.value.trim() || "";
    const descripcionVal = inputDescripcion?.value.trim() || "";
    const precioVal = Number(inputPrecio?.value);
    const stockVal = Number(inputStock?.value);
    const categoriaVal = selectCategoria?.value ? Number(selectCategoria.value) : 0;
    const imagenVal = inputImagen?.value.trim() || "";
    const disponibleVal = checkboxDisponible ? checkboxDisponible.checked : true;

    if (!nombreVal || !descripcionVal || !imagenVal || !categoriaVal || isNaN(precioVal) || isNaN(stockVal)) {
        alert("Por favor complete todos los campos obligatorios.");
        return;
    }

    if (precioVal <= 0) {
        alert("El precio debe ser un número mayor a 0.");
        return;
    }

    if (stockVal < 0) {
        alert("El stock no puede ser un número negativo.");
        return;
    }

    const catObj = getCategorias().find(c => c.id === categoriaVal);
    if (!catObj) {
        alert("La categoría seleccionada no es válida.");
        return;
    }

    const productos = getProductosAdmin();

    if (idStr) {
        const idNum = Number(idStr);
        const prod = productos.find(p => p.id === idNum);
        if (prod) {
            prod.nombre = nombreVal;
            prod.descripcion = descripcionVal;
            prod.precio = precioVal;
            prod.stock = stockVal;
            prod.categoria = catObj;
            prod.imagen = imagenVal;
            prod.disponible = disponibleVal;
        }
    } else {
        const nuevoProd: Product = {
            id: Date.now(),
            nombre: nombreVal,
            descripcion: descripcionVal,
            precio: precioVal,
            stock: stockVal,
            categoria: catObj,
            imagen: imagenVal,
            disponible: disponibleVal,
            eliminado: false,
            createdAt: new Date().toISOString()
        };
        productos.push(nuevoProd);
    }

    saveProductos(productos);
    cerrarModal();
    renderizarTablaProductos();
});

agregarLogout();
guardRoutes();
renderizarTablaProductos();
