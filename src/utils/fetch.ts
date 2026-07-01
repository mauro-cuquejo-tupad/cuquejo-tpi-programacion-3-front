import type { Product } from "../types/product";
import type { ICategoria } from "../types/categoria";
import type { DetallePedido, Pedido } from "../types/pedido";
import type { Usuario } from "../types/usuario";
import type { Rol } from "../types/Rol";
import type { Estados } from "../types/estados";
import type { FormaDePago } from "../types/formaPago";
import type { IUser } from "../types/IUser";
import { getJsonData, saveJsonData } from "./localStorage";

const USERS_KEY = "users";
const CATEGORIAS_KEY = "categorias";
const PRODUCTOS_KEY = "productos";
const PEDIDOS_KEY = "pedidos";

// ==========================================
// 1. HTTP Fetchers (Carga inicial desde JSON)
// ==========================================

export const fetchUsuarios = async (): Promise<Usuario[]> => {
  const res = await fetch("/data/usuarios.json");
  const data = await res.json();
  return data.map((usuario: any) => ({
    id: usuario.id,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    mail: usuario.mail,
    rol: usuario.rol as Rol,
    password: usuario.password,
    celular: usuario.celular
  }));
};

export const fetchCategorias = async (): Promise<ICategoria[]> => {
  const res = await fetch("/data/categorias.json");
  const data = await res.json();
  return data.map((categoria: any) => ({
    id: categoria.id,
    eliminado: categoria.eliminado ?? false,
    createdAt: categoria.createdAt ?? new Date().toISOString(),
    nombre: categoria.nombre,
    descripcion: categoria.descripcion
  }));
};

export const fetchProductos = async (): Promise<Product[]> => {
  const res = await fetch("/data/productos.json");
  const data = await res.json();
  const categorias = await fetchCategorias();
  return data.map((p: any) => ({
    id: p.id,
    eliminado: p.eliminado ?? false,
    createdAt: p.createdAt ?? new Date().toISOString(),
    nombre: p.nombre,
    precio: p.precio,
    descripcion: p.descripcion,
    stock: p.stock,
    imagen: p.imagen,
    disponible: p.disponible,
    categoria: p.categoriaId ? categorias.find(c => c.id === p.categoriaId) : (p.categoria ?? undefined)
  }));
};

export const fetchPedidos = async (): Promise<Pedido[]> => {
  const res = await fetch("/data/pedidos.json");
  const data = await res.json();
  return data.map((pedido: any) => ({
    id: pedido.id,
    fecha: pedido.fecha,
    estado: pedido.estado as Estados,
    total: pedido.total,
    formaPago: pedido.formaPago as FormaDePago,
    detalles: pedido.detalles as DetallePedido[],
    usuarioDto: pedido.usuarioDto as Usuario
  }));
};

// ==========================================
// 2. API / Backend Services (Lógica de Negocio)
// ==========================================

// --- Usuarios ---
export const getUsuarios = (): IUser[] => {
  return getJsonData<IUser>(USERS_KEY);
};

export const getUsuarioByEmail = (email: string): IUser | null => {
  const users = getUsuarios();
  return users.find(u => u.email === email) || null;
};

export const crearUsuario = (usuario: IUser): void => {
  const users = getUsuarios();
  users.push(usuario);
  saveJsonData(USERS_KEY, users);
};

// --- Categorías ---
export const getCategorias = (): ICategoria[] => {
  const list = getJsonData<ICategoria>(CATEGORIAS_KEY);
  return list.filter(cat => !cat.eliminado);
};

export const getCategoriasAll = (): ICategoria[] => {
  return getJsonData<ICategoria>(CATEGORIAS_KEY);
};

export const saveCategorias = (categorias: ICategoria[]): void => {
  saveJsonData(CATEGORIAS_KEY, categorias);
};

// --- Productos ---
export const getProductos = (): Product[] => {
  const list = getJsonData<Product>(PRODUCTOS_KEY);
  return list.filter(p => !p.eliminado);
};

export const getProductosAdmin = (): Product[] => {
  const list = getJsonData<Product>(PRODUCTOS_KEY);
  return list.filter(p => !p.eliminado);
};

export const getProductosByEstado = (disponible: boolean): Product[] => {
  const list = getJsonData<Product>(PRODUCTOS_KEY);
  return list.filter(p => p.disponible === disponible && !p.eliminado);
};

export const saveProductos = (productos: Product[]): void => {
  saveJsonData(PRODUCTOS_KEY, productos);
};

// --- Pedidos ---
export const getPedidos = (): Pedido[] => {
  return getJsonData<Pedido>(PEDIDOS_KEY);
};

export const savePedidos = (pedidos: Pedido[]): void => {
  saveJsonData(PEDIDOS_KEY, pedidos);
};

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