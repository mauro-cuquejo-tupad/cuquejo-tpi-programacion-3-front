import type { IUser } from "../../../types/IUser";
import { navigate } from "../../../utils/navigate";
import { saveUsers, getUsersByEmail } from "../../../utils/localStorage";
import { guardRoutes } from "../../../utils/auth";

const form = document.getElementById("form") as HTMLFormElement;

const inputEmail = document.getElementById("email") as HTMLInputElement;
const inputPassword = document.getElementById("password") as HTMLInputElement;


form.addEventListener("submit", (e: SubmitEvent) => {
    e.preventDefault();

    const valueEmail = inputEmail.value;
    const valuePassword = inputPassword.value;
    if (!valueEmail || !valuePassword) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    const user: IUser = {
        email: valueEmail,
        password: valuePassword,
        loggedIn: false,
        role: "client",
    };

    if (getUsersByEmail(user.email)) {
        alert("El usuario ya existe. Por favor, inicie sesión.");
    } else {
        saveUsers(user);
        alert("Registro exitoso. Ahora puede iniciar sesión.");
        navigate("/src/pages/auth/login/login.html");
    }
});

guardRoutes();