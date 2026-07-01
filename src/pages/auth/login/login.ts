import type { IUser } from "../../../types/IUser";
import { guardRoutes, saveSessionUser } from "../../../utils/auth";
import { getUsuarioByEmail } from "../../../utils/fetch";
import { navigate } from "../../../utils/navigate";
import { HOME_ADMIN, HOME_STORE } from "../../../utils/routes";

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

  const usuarioBuscado: IUser | null = getUsuarioByEmail(valueEmail);
  if (!usuarioBuscado) {
    alert("Usuario no encontrado");
    return;
  } else if (usuarioBuscado.password !== valuePassword) {
    alert("Contraseña incorrecta");
    return;
  } else {
    alert("Login exitoso");
    usuarioBuscado.loggedIn = true;
    saveSessionUser(usuarioBuscado);

    if (usuarioBuscado.role === "ADMIN") {
      navigate(HOME_ADMIN);
    } else {
      navigate(HOME_STORE);
    }
  }
});


guardRoutes();