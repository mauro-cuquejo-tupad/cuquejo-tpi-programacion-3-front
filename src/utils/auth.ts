
import type { IUser } from "../types/IUser";
import { getUSer, removeStoreFilters, removeUser } from "./localStorage";
import { navigate } from "./navigate";
import { CART_PAGE, HOME_ADMIN, HOME_CLIENT, HOME_STORE, INDEX_PAGE, LOGIN_PAGE, PRODUCT_DETAIL, REGISTRO_PAGE, ROOT_PAGE, VALID_PAGES } from "./routes"

export const logout = () => {
    removeStoreFilters();
    removeUser();
    navigate("/src/pages/auth/login/login.html");
};

export const guardRoutes = () => {
    const usuario: string | null = getUSer();
    const pagina: string = window.location.pathname;

    if (!VALID_PAGES.has(pagina)) {
        navigate(HOME_STORE);
        return;
    }

    if (pagina === ROOT_PAGE || pagina === INDEX_PAGE) {
        navigate(LOGIN_PAGE);
        return;
    }

    if (!usuario) {
        if (!(pagina === LOGIN_PAGE || pagina === REGISTRO_PAGE)) {
            alert("No hay un usuario logueado. Será redirigido a la página de login");
            navigate(LOGIN_PAGE);
        }
        return;
    }

    try {
        let usuarioParseado: IUser = JSON.parse(usuario);

        if (!usuarioParseado.loggedIn) {
            alert("No hay un usuario logueado. Será redirigido a la página de login");
            navigate(LOGIN_PAGE);
            return;
        }

        if (usuarioParseado.role === "USUARIO" && (pagina === HOME_ADMIN ||
            pagina === LOGIN_PAGE ||
            pagina === REGISTRO_PAGE ||
            pagina === ROOT_PAGE)) {
            alertaRedireccion(pagina);

            navigate(HOME_STORE);
            return;
        }

        if (usuarioParseado.role === "ADMIN" && (pagina === HOME_STORE ||
            pagina === LOGIN_PAGE ||
            pagina === REGISTRO_PAGE ||
            pagina === HOME_CLIENT ||
            pagina === PRODUCT_DETAIL ||
            pagina === CART_PAGE)) {
            alertaRedireccion(pagina);
            navigate(HOME_ADMIN);
            return;
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
    pagina === LOGIN_PAGE || pagina === REGISTRO_PAGE ?
        alert("Usuario ya se encuentra logueado") :
        alert("Ingreso no autorizado. Será redirigido al home");
}

guardRoutes();