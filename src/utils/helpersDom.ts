import { logout } from "./auth";

//helpers DOM para crear elementos
export const crearBoton = (id: string, classNames: string | null, textContent: string): HTMLButtonElement => {
  const boton: HTMLButtonElement = document.createElement("button");
  boton.id = id;
  boton.type = "button";
  if (classNames) boton.className = classNames;
  boton.textContent = textContent;
  return boton;
};

export const agregarLogout = (): void => {
  const buttonLogout = document.getElementById("logoutButton") as HTMLButtonElement;

  buttonLogout?.addEventListener("click", () => {
    logout();
  });
}