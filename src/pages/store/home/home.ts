import { categorias, PRODUCTS } from "../../../data/data";
import type { ICategoria } from "../../../types/categoria";
import type { FiltrosBusqueda } from "../../../types/filtros";
import type { Product } from "../../../types/product";
import { agregarLogout, guardRoutes } from "../../../utils/auth";
import { getStoreFilters, saveStoreFilters } from "../../../utils/localStorage";
import { actualizarContadorCarrito, agregarAlCarrito } from "../cart/cart";

const listaCategorias : HTMLUListElement | null = document.querySelector<HTMLUListElement>("#lista-categorias");
const contenedorProductos : HTMLElement | null = document.querySelector<HTMLElement>("#contenedor-productos");
const inputBuscarProductos : HTMLInputElement | null = document.querySelector<HTMLInputElement>("#txt_buscar_productos");

let categoriaSeleccionada: string = "";


//persistencia de filtros
const guardarFiltros = () : void => {
  const datosFiltros: FiltrosBusqueda = {
    categoria: categoriaSeleccionada || "Todos los productos",
    busqueda: inputBuscarProductos?.value || "",
  };
  saveStoreFilters(datosFiltros);
};

const cargarFiltros = () => {
  const datosFiltros = getStoreFilters();
  if (!datosFiltros) return;
  try {
    categoriaSeleccionada = datosFiltros.categoria || "";

    if (inputBuscarProductos && datosFiltros.busqueda) {
      inputBuscarProductos.value = datosFiltros.busqueda;
    }
  } catch (error) {
    console.error(error);
  }
};


//helpers DOM para crear elementos
const crearCategoria = (nombre: string): HTMLLIElement => {
  const li: HTMLLIElement = document.createElement("li");
      li.className = "categoria";
      li.dataset.categoria = nombre;
      li.innerText = nombre;
      return li;
}

const crearArticuloProducto = (producto: Product) :HTMLElement => {
    const articulo: HTMLElement = document.createElement("article");
    articulo.className = "producto-articulo";
    articulo.id = `articulo-${producto.id}`;

    const titulo:HTMLHeadElement = document.createElement("h3");
    titulo.textContent = producto.nombre;

    const imagen: HTMLImageElement = document.createElement("img");
    imagen.src = `../../../assets/img/${producto.imagen}`;
    imagen.alt = producto.nombre;

    const descripcion: HTMLParagraphElement = document.createElement("p");
    descripcion.textContent = producto.descripcion;

    const precio: HTMLSpanElement = document.createElement("span");
    precio.classList.add("precio");
    precio.textContent = '$' + producto.precio;

    const botonAgregar: HTMLButtonElement = document.createElement("button");
    botonAgregar.id = "btn-agregar-" + producto.id;
    botonAgregar.type = "button";
    botonAgregar.className = "btn-agregar";
    botonAgregar.textContent = "Agregar al carrito";
    botonAgregar.addEventListener("click", () => {
      agregarAlCarrito(producto.id);
      actualizarContadorCarrito();
      renderizarBotonProductoAgregado(botonAgregar);
    });

    articulo.appendChild(titulo);
    articulo.appendChild(imagen);
    articulo.appendChild(descripcion);
    articulo.appendChild(precio);
    articulo.appendChild(botonAgregar);
    return articulo;
};


//renderers
const cargarCategorias = () : void => {
  if (!listaCategorias) return;
  listaCategorias.innerHTML = "";

  const todos: HTMLLIElement = crearCategoria("Todos los productos");
  listaCategorias.appendChild(todos);

  categorias.forEach((c: ICategoria) => {
    if (!c.eliminado) listaCategorias.appendChild(crearCategoria(c.nombre));
  });

  // marcar seleccionada según estado guardado
  if (categoriaSeleccionada) {
    const seleccionado: Element | undefined = Array.from(listaCategorias.children)
    .find((n: Element) => (n.textContent || "") === categoriaSeleccionada);

      if (seleccionado) {
        seleccionado.classList.add("seleccionado");
      } else {
        //si no existe la categoría guardada, marcar "todos los productos"
        (listaCategorias.children[0]).classList.add("seleccionado");
        categoriaSeleccionada = "Todos los productos";
      }

  } else {
    (listaCategorias.children[0]).classList.add("seleccionado");
    categoriaSeleccionada = "Todos los productos";
  }
};

const cargarProductos = (lista: Product[] = PRODUCTS) : void => {
  if (!contenedorProductos) return;

  contenedorProductos.innerHTML = "";
  if(lista.length === 0) {
    const mensaje: HTMLHeadingElement = document.createElement("h2");
    mensaje.classList.add("no-resultados");
    mensaje.textContent = "No se encontraron productos que coincidan con los filtros aplicados.";
    contenedorProductos.appendChild(mensaje);
    return;
  }

  lista.forEach((p: Product) => {
    if(!p.eliminado) contenedorProductos.appendChild(crearArticuloProducto(p));
  });
};

const renderizarBotonProductoAgregado = (boton: HTMLButtonElement) : void => {
  boton.textContent = "✓ Agregado";
  boton.disabled = true;
  boton.classList.add("agregado");
  setTimeout(() => {
    boton.textContent = "Agregar al carrito";
    boton.disabled = false;
    boton.classList.remove("agregado");
  }, 1000);
};

//filtrado
const filtrarYRenderizar = (): void => {
  const texto = (inputBuscarProductos?.value || "").trim().toLocaleLowerCase();
  const cat = (categoriaSeleccionada || "Todos los productos").toLocaleLowerCase();

  const resultados = PRODUCTS.filter((p: Product) => {
    if (p.eliminado) return false;

    const coincideCategoria = cat === "todos los productos" ||
    p.categorias.some((c: ICategoria) => c.nombre.toLocaleLowerCase().includes(cat));

    const coincideNombre = texto === "" || p.nombre.toLocaleLowerCase().includes(texto);

    return coincideCategoria && coincideNombre;
  });

  cargarProductos(resultados);
  guardarFiltros();
};

//delegacion de eventos para categorías
const inicializarDelegacionCategorias = () => {
  if (!listaCategorias) return;
  listaCategorias.addEventListener("click", (e: Event) => {

    const target: HTMLElement | null = e.target as HTMLElement;

    if (!target || !target.matches("li.categoria")) return;

    //actualizar clases
    listaCategorias.querySelectorAll<HTMLLIElement>(".seleccionado").forEach((el: HTMLLIElement) => el.classList.remove("seleccionado"));
    target.classList.add("seleccionado");

    //actualizar estado y UI
    categoriaSeleccionada = target.textContent ||  "Todos los productos";
    if (inputBuscarProductos) inputBuscarProductos.value = "";
    filtrarYRenderizar();
  });
};


//inicializar
agregarLogout();

cargarFiltros();
cargarCategorias();
inicializarDelegacionCategorias();
filtrarYRenderizar();
actualizarContadorCarrito();

//listeners
inputBuscarProductos?.addEventListener("input", () => {
  filtrarYRenderizar();
});

guardRoutes();