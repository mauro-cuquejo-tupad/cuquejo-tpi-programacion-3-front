import type { Estados } from "./estados"
import type { FormaDePago } from "./formaPago"
import type { Product } from "./product"
import type { Usuario } from "./usuario"

export interface Pedido {
    id: number;
    fecha: string;
    estado: Estados;
    total: number;
    formaPago: FormaDePago;
    detalles: DetallePedido[];
    usuarioDto: Usuario
  };

export interface DetallePedido {
    cantidad: number;
        subtotal: number;
        producto: Product
}