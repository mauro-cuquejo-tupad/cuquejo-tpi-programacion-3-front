import type { IUser } from "../types/IUser";
import { fetchUsuarios, fetchCategorias, fetchProductos, fetchPedidos } from "./fetch";
import { 
    getData,
    saveData,
    removeData,
    saveJsonData
} from "./localStorage";
import { navigate } from "./navigate";
import { VALID_ADMIN_PAGES, VALID_USER_PAGES, HOME_STORE, LOGIN_PAGE, HOME_ADMIN, VALID_PAGES } from "./routes"

const USER_DATA_KEY = "userData";
const STORE_FILTERS_KEY = "store_filters";

export const getSessionUser = (): IUser | null => {
    return getData<IUser>(USER_DATA_KEY);
};

export const saveSessionUser = (user: IUser): void => {
    saveData<IUser>(USER_DATA_KEY, user);
};

export const removeSessionUser = (): void => {
    removeData(USER_DATA_KEY);
};

export const removeStoreFilters = (): void => {
    removeData(STORE_FILTERS_KEY);
};

export const logout = () => {
    removeStoreFilters();
    removeSessionUser();
    navigate(LOGIN_PAGE);
};

let guardDeRutasEnEjecucion = false;

export const guardRoutes = () => {
    if (guardDeRutasEnEjecucion) return;
    guardDeRutasEnEjecucion = true;

    const usuario = getSessionUser();
    const pagina: string = window.location.pathname;

    if (!usuario) {
        if (!VALID_PAGES.has(pagina)) {
            navigate(LOGIN_PAGE);
        }
        return;
    }

    try {
        if (!usuario.loggedIn) {
            navigate(LOGIN_PAGE);
            return;
        }

        if (usuario.role === "USUARIO") {
            if (!VALID_USER_PAGES.has(pagina)) {
                alertaRedireccion(pagina);
                navigate(HOME_STORE);
                return;
            }
        }

        if (usuario.role === "ADMIN") {
            if (!VALID_ADMIN_PAGES.has(pagina)) {
                alertaRedireccion(pagina);
                navigate(HOME_ADMIN);
                return;
            }
        }
    } catch (error) {
        if (error instanceof Error) {
            console.log("Error:", error.message);
            removeSessionUser();
            navigate(LOGIN_PAGE);
        }
        return;
    }
}

const alertaRedireccion = (pagina: string): void => {
    pagina === LOGIN_PAGE ?
        alert("Usuario ya se encuentra logueado") :
        alert("Ingreso no autorizado. Será redirigido al home");
}

export const inicializarDatos = async () => {
    const usuariosExistentes = localStorage.getItem("users");
    if (!usuariosExistentes) {
        try {
            const usuariosFetched = await fetchUsuarios();
            const usuariosList: IUser[] = [];
            usuariosFetched.forEach((usuario) => {
                const iusuario: IUser = {
                    email: usuario.mail,
                    password: usuario.password,
                    loggedIn: false,
                    role: usuario.rol,
                    celular: usuario.celular,
                    nombre: usuario.nombre,
                    apellido: usuario.apellido
                };
                usuariosList.push(iusuario);
            });
            saveJsonData("users", usuariosList);
        } catch (error) {
            console.error("Error al inicializar usuarios:", error);
        }
    }

    const categoriasExistentes = localStorage.getItem("categorias");
    if (!categoriasExistentes) {
        try {
            const categoriasFetched = await fetchCategorias();
            saveJsonData("categorias", categoriasFetched);
        } catch (error) {
            console.error("Error al inicializar categorías:", error);
        }
    }

    const productosExistentes = localStorage.getItem("productos");
    if (!productosExistentes) {
        try {
            const productosFetched = await fetchProductos();
            saveJsonData("productos", productosFetched);
        } catch (error) {
            console.error("Error al inicializar productos:", error);
        }
    }

    const pedidosExistentes = localStorage.getItem("pedidos");
    if (!pedidosExistentes) {
        try {
            const pedidosFetched = await fetchPedidos();
            saveJsonData("pedidos", pedidosFetched);
        } catch (error) {
            console.error("Error al inicializar pedidos:", error);
        }
    }
};

inicializarDatos().then(() => {
    guardRoutes();
});