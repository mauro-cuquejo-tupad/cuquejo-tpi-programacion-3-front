import type { FiltrosBusqueda } from "../types/filtros";
import type { IUser } from "../types/IUser";
import type { CartItem, Product } from "../types/product";

const USER_DATA_KEY: string = "userData";
const STORE_FILTERS_KEY: string = "store_filters";

// --- Datos de usuario actual (Sesión) ---
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

// --- Filtros de búsqueda en home store ---
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

// --- Driver Abstracto Genérico de LocalStorage ---
export const getJsonData = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export const saveJsonData = <T>(key: string, data: T[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// --- Gestión de Carrito de Compras ---
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