// src/utils/data.ts
import type { Product } from "../types/product";
import type { ICategoria } from "../types/categoria";
import type { DetallePedido, Pedido } from "../types/pedido";
import usuariosJson from "../data/usuarios.json"
import categoriasJson from "../data/categorias.json"
import productosJson from "../data/productos.json";
import pedidosJson from "../data/pedidos.json";
import type { Estados } from "../types/estados";
import type { FormaDePago } from "../types/formaPago";
import type { Usuario } from "../types/usuario";
import type { Rol } from "../types/Rol";

export const getUsuarios: Usuario[] = usuariosJson.map((usuario) => ({
  id: usuario.id,
  nombre: usuario.nombre,
  apellido: usuario.apellido,
  mail: usuario.mail,
  rol: usuario.rol as Rol,
  password: usuario.password,
  celular: usuario.celular
}));

export const getCategorias: ICategoria[] = categoriasJson.map((categoria) => ({
      id: categoria.id,
      eliminado: false,
      createdAt: new Date().toISOString(),
      nombre: categoria.nombre,
      descripcion: categoria.descripcion
    }));

export const getProductos: Product[] = productosJson.map((p) => ({
    id: p.id,
    eliminado: false,
    createdAt: new Date().toISOString(),
    nombre: p.nombre,
    precio: p.precio,
    descripcion: p.descripcion,
    stock: p.stock,
    imagen: p.imagen,
    disponible: p.disponible,
    categoria: getCategorias.find((c) => c.nombre === p.categoria.nombre)
}));

export const getPedidos : Pedido[] = pedidosJson.map((pedido) => ({
  id: pedido.id,
  fecha: pedido.fecha,
  estado: pedido.estado as Estados,
  total: pedido.total,
  formaPago: pedido.formaPago as FormaDePago,
  detalles: pedido.detalles as DetallePedido[],
  usuarioDto: pedido.usuarioDto as Usuario

}));