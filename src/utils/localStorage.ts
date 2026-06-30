import type { FiltrosBusqueda } from "../types/filtros";
import type { IUser } from "../types/IUser";
import type { CartItem, Product } from "../types/product";
import type { ICategoria } from "../types/categoria";
import type { Pedido } from "../types/pedido";


const USER_DATA_KEY: string = "userData";
const STORE_FILTERS_KEY: string = "store_filters";
const USERS_KEY: string = "users";


// datos de usuario actual
export const getUSer = () => {
  return localStorage.getItem(USER_DATA_KEY);
};

export const saveUser = (user: IUser) => {
  const parseUser = JSON.stringify(user);
  localStorage.setItem(USER_DATA_KEY, parseUser);
};

export const removeUser = () => {
  localStorage.removeItem(USER_DATA_KEY);
};


// datos de filtros de busqueda en home store
export const getStoreFilters = (): FiltrosBusqueda | null => {
  const filtersData = localStorage.getItem(STORE_FILTERS_KEY);
  if (!filtersData) return null;
  try {
    return JSON.parse(filtersData);
  } catch (error) {
    console.error("Error al parsear los filtros de búsqueda:", error);
    return null;
  }
};

export const saveStoreFilters = (filters: FiltrosBusqueda) => {
  localStorage.setItem(STORE_FILTERS_KEY, JSON.stringify(filters));
};


export const removeStoreFilters = () => {
  localStorage.removeItem(STORE_FILTERS_KEY);
};



//datos de usuarios registrados
export const getUsers = () => {
  return localStorage.getItem(USERS_KEY);
};

export const getUsersByEmail = (email: string): IUser | null => {
  const usersData = getUsers();
  if (usersData) {
    const usersArray: IUser[] = JSON.parse(usersData);
    return usersArray.find(user => user.email === email) || null;
  }
  return null;
};

export const saveUsers = (user: IUser) => {
  try {
    const usuariosGuardados = getUsers();
    const usuarios: IUser[] = usuariosGuardados ? JSON.parse(usuariosGuardados) : [];
    usuarios.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(usuarios));
  } catch {
    localStorage.setItem(USERS_KEY, JSON.stringify([user]));
  }
};

export const removeUsers = () => {
  localStorage.removeItem(USERS_KEY);
};


// datos de carrito de compras
const getCartKey = (): string => {
  const userEmail = getUSer();
  if (!userEmail) {
    throw new Error("No hay un usuario logueado");
  }
  try {
    const userData: IUser = JSON.parse(userEmail);
    return `cart_${userData.email}`;
  } catch (error) {
    console.error("Error al parsear el usuario logueado:", error);
    throw new Error("Error al obtener la clave del carrito");
  }
};

export const getProductCart = (): string | null => {
  return localStorage.getItem(getCartKey());
};

export const deleteProductCart = (): void => {
  localStorage.removeItem(getCartKey());
};

export const addProductCart = (product: Product, cantidad: number = 1): void => {
  try {
    const carritoGuardado: string | null = getProductCart();
    let cartItems: CartItem[] = carritoGuardado ? JSON.parse(carritoGuardado) : [];

    let item: CartItem | undefined = cartItems.find((c: CartItem) => c.id === product.id);
    if (item) {
      item.cantidad += cantidad;
    } else {
      let cartItem: CartItem = {
        id: product.id,
        cantidad: cantidad,
        producto: product
      };
      cartItems.push(cartItem);
    }

    localStorage.setItem(getCartKey(), JSON.stringify(cartItems));
  } catch {
    localStorage.setItem(getCartKey(), JSON.stringify([{
      id: product.id,
      cantidad: 1,
      producto: product
    }]));
  }
};

export const removeProductCart = (product: Product): void => {
  try {
    const carritoGuardado: string | null = getProductCart();
    let cartItems: CartItem[] = carritoGuardado ? JSON.parse(carritoGuardado) : [];

    const item: CartItem | undefined = cartItems.find((c: CartItem) => c.id === product.id);
    if (!item) return;

    if (item.cantidad > 1) {
      item.cantidad -= 1;
    } else {
      cartItems = cartItems.filter((c: CartItem) => c.id !== product.id);
    }

    if (cartItems.length > 0) {
      localStorage.setItem(getCartKey(), JSON.stringify(cartItems));
    } else {
      localStorage.removeItem(getCartKey());
    }

  } catch {
    console.error("error al remover producto");
    localStorage.removeItem(getCartKey());
  }
};

const CATEGORIAS_KEY = "categorias";
const PRODUCTOS_KEY = "productos";
const PEDIDOS_KEY = "pedidos";

// Categorías (Servicio)
export const getCategorias = (): ICategoria[] => {
  const data = localStorage.getItem(CATEGORIAS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveCategorias = (categorias: ICategoria[]) => {
  localStorage.setItem(CATEGORIAS_KEY, JSON.stringify(categorias));
};

// Productos (Servicio)
export const getProductos = (): Product[] => {
  const data = localStorage.getItem(PRODUCTOS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveProductos = (productos: Product[]) => {
  localStorage.setItem(PRODUCTOS_KEY, JSON.stringify(productos));
};

// Pedidos (Servicio)
export const getPedidos = (): Pedido[] => {
  const data = localStorage.getItem(PEDIDOS_KEY);
  return data ? JSON.parse(data) : [];
};

export const savePedidos = (pedidos: Pedido[]) => {
  localStorage.setItem(PEDIDOS_KEY, JSON.stringify(pedidos));
};

// Métodos específicos (Servicios filtrados)
export const getPedidosByUsuario = (email: string): Pedido[] => {
  return getPedidos().filter(p => p.usuarioDto.mail === email);
};

export const getPedidosByEstado = (estado: string): Pedido[] => {
  const estadoUpper = estado.toUpperCase();
  if (estadoUpper === "TODOS") {
    return getPedidos();
  }
  return getPedidos().filter(p => p.estado.toUpperCase() === estadoUpper);
};

export const removeAllProductsCart = (product: Product): void => {
  try {
    const carritoGuardado: string | null = getProductCart();
    let cartItems: CartItem[] = carritoGuardado ? JSON.parse(carritoGuardado) : [];

    const item: CartItem | undefined = cartItems.find((c: CartItem) => c.id === product.id);
    if (!item) return;

    cartItems = cartItems.filter((c: CartItem) => c.id !== product.id);

    if (cartItems.length > 0) {
      localStorage.setItem(getCartKey(), JSON.stringify(cartItems));
    } else {
      localStorage.removeItem(getCartKey());
    }

  } catch {
    console.error("error al remover producto");
    localStorage.removeItem(getCartKey());
  }
};