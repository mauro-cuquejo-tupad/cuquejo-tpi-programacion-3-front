
import type { IUser } from "../types/IUser";
import { getUsuarios } from "./fetch";
import { getUSer, getUsersByEmail, removeStoreFilters, removeUser, saveUsers } from "./localStorage";
import { navigate } from "./navigate";
import { VALID_ADMIN_PAGES, VALID_USER_PAGES, HOME_STORE, LOGIN_PAGE, HOME_ADMIN, VALID_PAGES } from "./routes"

export const logout = () => {
    removeStoreFilters();
    removeUser();
    navigate(LOGIN_PAGE);
};

export const guardRoutes = () => {
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
    pagina === LOGIN_PAGE ?
        alert("Usuario ya se encuentra logueado") :
        alert("Ingreso no autorizado. Será redirigido al home");
}

export const inicializarUsuarios = () => {
    getUsuarios.forEach((usuario) => {
        const iusuario: IUser = {
            email: usuario.mail,
            password: usuario.password,
            loggedIn: false,
            role: usuario.rol,
        }
        if (getUsersByEmail(usuario.mail) == null) {
            saveUsers(iusuario);
        }
    })
};

guardRoutes();
inicializarUsuarios();