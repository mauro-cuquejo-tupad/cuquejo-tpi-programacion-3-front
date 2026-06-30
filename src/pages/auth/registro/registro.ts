import type { IUser } from "../../../types/IUser";
import { navigate } from "../../../utils/navigate";
import { saveUser } from "../../../utils/localStorage";
import { getUsuarioByEmail, crearUsuario } from "../../../utils/fetch";
import { HOME_STORE } from "../../../utils/routes";

const form = document.getElementById("form") as HTMLFormElement;

const inputNombre = document.getElementById("nombre") as HTMLInputElement;
const inputEmail = document.getElementById("email") as HTMLInputElement;
const inputPassword = document.getElementById("password") as HTMLInputElement;

form.addEventListener("submit", (e: SubmitEvent) => {
    e.preventDefault();

    const valueNombre = inputNombre.value.trim();
    const valueEmail = inputEmail.value.trim();
    const valuePassword = inputPassword.value;

    if (!valueNombre || !valueEmail || !valuePassword) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(valueEmail)) {
        alert("Por favor, ingrese un email válido.");
        return;
    }

    if (valuePassword.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres.");
        return;
    }

    if (getUsuarioByEmail(valueEmail)) {
        alert("El usuario ya existe. Por favor, inicie sesión.");
        return;
    }

    const user: IUser = {
        email: valueEmail,
        password: valuePassword,
        loggedIn: false,
        role: "USUARIO",
    };

    // Guardar en la lista global de usuarios
    crearUsuario(user);

    // Auto-login
    user.loggedIn = true;
    saveUser(user);

    alert("Registro exitoso. ¡Bienvenido!");
    navigate(HOME_STORE);
});
