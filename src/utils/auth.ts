
import type { IUser } from "../types/IUser";
import { getUSer, removeStoreFilters, removeUser } from "./localStorage";
import { navigate } from "./navigate";
import { VALID_PAGES, VALID_ADMIN_PAGES, VALID_USER_PAGES, HOME_STORE, LOGIN_PAGE, REGISTRO_PAGE, HOME_ADMIN } from "./routes"

export const logout = () => {
    removeStoreFilters();
    removeUser();
    navigate("/src/pages/auth/login/login.html");
};

export const guardRoutes = () => {
    const usuario: string | null = getUSer();
    const pagina: string = window.location.pathname;

    if (!usuario) {
        if (!VALID_PAGES.has(pagina)) {
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

        if (usuarioParseado.role === "USUARIO" && !VALID_USER_PAGES.has(pagina)) {
            alertaRedireccion(pagina);

            navigate(HOME_STORE);
            return;
        }

        if (usuarioParseado.role === "ADMIN" && !VALID_ADMIN_PAGES.has(pagina)) {
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