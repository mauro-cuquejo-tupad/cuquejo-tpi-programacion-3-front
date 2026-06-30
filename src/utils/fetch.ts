import type { Product } from "../types/product";
import type { ICategoria } from "../types/categoria";
import type { DetallePedido, Pedido } from "../types/pedido";
import type { Usuario } from "../types/usuario";
import type { Rol } from "../types/Rol";
import type { Estados } from "../types/estados";
import type { FormaDePago } from "../types/formaPago";

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