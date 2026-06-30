import type { IUser } from "../types/IUser";
import { fetchUsuarios, fetchCategorias, fetchProductos, fetchPedidos } from "./fetch";
import { 
    getUSer, 
    removeStoreFilters, 
    removeUser, 
    saveJsonData
} from "./localStorage";
import { navigate } from "./navigate";
import { VALID_ADMIN_PAGES, VALID_USER_PAGES, HOME_STORE, LOGIN_PAGE, HOME_ADMIN, VALID_PAGES } from "./routes"

export const logout = () => {
    removeStoreFilters();
    removeUser();
    navigate(LOGIN_PAGE);
};

// para evitar que se ejecute multiple veces por asincronía
let guardDeRutasEnEjecucion = false;

export const guardRoutes = () => {
    if (guardDeRutasEnEjecucion) return;
    guardDeRutasEnEjecucion = true;

    const usuario: string | null = getUSer();
    const pagina: string = window.location.pathname;

    if (!usuario) {
        if (!VALID_PAGES.has(pagina)) {
            navigate(LOGIN_PAGE);
        }
        return;
    }

    try {
        let usuarioParseado: IUser = JSON.parse(usuario);

        if (!usuarioParseado.loggedIn) {
            navigate(LOGIN_PAGE);
            return;
        }

        if (usuarioParseado.role === "USUARIO") {
            if (!VALID_USER_PAGES.has(pagina)) {
                alertaRedireccion(pagina);
                navigate(HOME_STORE);
                return;
            }
        }

        if (usuarioParseado.role === "ADMIN") {
            if (!VALID_ADMIN_PAGES.has(pagina)) {
                alertaRedireccion(pagina);
                navigate(HOME_ADMIN);
                return;
            }
        }
    } catch (error) {
        if (error instanceof Error) {
            console.log("Error:", error.message);
            removeUser();
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
    // 1. Inicializar usuarios si no hay ninguno en localStorage
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
                };
                usuariosList.push(iusuario);
            });
            saveJsonData("users", usuariosList);
        } catch (error) {
            console.error("Error al inicializar usuarios:", error);
        }
    }

    // 2. Inicializar categorías si no hay ninguna en localStorage
    const categoriasExistentes = localStorage.getItem("categorias");
    if (!categoriasExistentes) {
        try {
            const categoriasFetched = await fetchCategorias();
            saveJsonData("categorias", categoriasFetched);
        } catch (error) {
            console.error("Error al inicializar categorías:", error);
        }
    }

    // 3. Inicializar productos si no hay ninguno en localStorage
    const productosExistentes = localStorage.getItem("productos");
    if (!productosExistentes) {
        try {
            const productosFetched = await fetchProductos();
            saveJsonData("productos", productosFetched);
        } catch (error) {
            console.error("Error al inicializar productos:", error);
        }
    }

    // 4. Inicializar pedidos si no hay ninguno en localStorage
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