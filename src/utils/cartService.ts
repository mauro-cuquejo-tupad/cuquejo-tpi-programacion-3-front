import type { CartItem, Product } from "../types/product";
import type { IUser } from "../types/IUser";
import { getData, saveData, removeData } from "./localStorage";

const USER_DATA_KEY = "userData";

const getCartKey = (): string => {
  const userSession = getData<IUser>(USER_DATA_KEY);
  if (!userSession) {
    throw new Error("No hay un usuario logueado");
  }
  return `cart_${userSession.email}`;
};

export const getProductCart = (): string | null => {
  try {
    const key = getCartKey();
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const deleteProductCart = (): void => {
  try {
    removeData(getCartKey());
  } catch (error) {
    console.error("Error al vaciar el carrito:", error);
  }
};

export const addProductCart = (product: Product, cantidad: number = 1): void => {
  try {
    const cartKey = getCartKey();
    const cartItems = getData<CartItem[]>(cartKey) || [];

    const item = cartItems.find((c: CartItem) => c.id === product.id);
    if (item) {
      item.cantidad += cantidad;
    } else {
      cartItems.push({
        id: product.id,
        cantidad: cantidad,
        producto: product
      });
    }

    saveData(cartKey, cartItems);
  } catch {
    try {
      saveData(getCartKey(), [{
        id: product.id,
        cantidad: 1,
        producto: product
      }]);
    } catch (e) {
      console.error("Error al agregar al carrito:", e);
    }
  }
};

export const removeProductCart = (product: Product): void => {
  try {
    const cartKey = getCartKey();
    let cartItems = getData<CartItem[]>(cartKey) || [];

    const item = cartItems.find((c: CartItem) => c.id === product.id);
    if (!item) return;

    if (item.cantidad > 1) {
      item.cantidad -= 1;
    } else {
      cartItems = cartItems.filter((c: CartItem) => c.id !== product.id);
    }

    if (cartItems.length > 0) {
      saveData(cartKey, cartItems);
    } else {
      removeData(cartKey);
    }
  } catch {
    try {
      removeData(getCartKey());
    } catch (e) {
      console.error("Error al remover producto:", e);
    }
  }
};

export const removeAllProductsCart = (product: Product): void => {
  try {
    const cartKey = getCartKey();
    let cartItems = getData<CartItem[]>(cartKey) || [];

    cartItems = cartItems.filter((c: CartItem) => c.id !== product.id);

    if (cartItems.length > 0) {
      saveData(cartKey, cartItems);
    } else {
      removeData(cartKey);
    }
  } catch {
    try {
      removeData(getCartKey());
    } catch (e) {
      console.error("Error al eliminar producto del carrito:", e);
    }
  }
};
