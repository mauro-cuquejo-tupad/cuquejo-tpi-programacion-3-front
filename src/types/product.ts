import type { ICategoria } from "./categoria";

export interface Product {
    id: number;
    eliminado: boolean;
    createdAt: string;
    nombre: string;
    precio: number;
    descripcion: string;
    stock: number;
    imagen: string;
    disponible: boolean;
    categoria: ICategoria | undefined
};

export interface CartItem {
    id: number;
    producto: Product;
    cantidad: number;
};