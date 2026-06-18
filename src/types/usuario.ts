import type { Rol } from "./Rol";

export interface Usuario {
    id: number;
      nombre: string;
      apellido: string;
      mail: string;
      password: string;
      celular: string;
      rol: Rol
}