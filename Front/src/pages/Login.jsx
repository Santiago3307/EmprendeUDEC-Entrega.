import { useState } from "react";
import api from "../services/api";

function Login() {
const [Correo, setCorreo] = useState("");
const [Contrasena, setContrasena] = useState("");
const [mensaje, setMensaje] = useState("");

const iniciarSesion = async (e) => {
e.preventDefault();

try {
  const respuesta = await api.post("/login", {
    Correo: Correo,
    Contrasena: Contrasena
  });

  setMensaje("¡Bienvenido " + respuesta.data.usuario.Nombre + "!");
  localStorage.setItem(
  "usuario",
  JSON.stringify(respuesta.data.usuario)
);

window.location.href = "/panel";
} catch (error) {
  setMensaje("Correo o contraseña incorrectos");
}


};

return ( <div> <h1>Iniciar sesión</h1>


  <form onSubmit={iniciarSesion}>
    <div>
      <label>Correo</label>
      <br />
      <input
        type="email"
        value={Correo}
        onChange={(e) => setCorreo(e.target.value)}
      />
    </div>

    <br />

    <div>
      <label>Contraseña</label>
      <br />
      <input
        type="password"
        value={Contrasena}
        onChange={(e) => setContrasena(e.target.value)}
      />
    </div>

    <br />

    <button type="submit">Iniciar sesión</button>
  </form>

  <p>{mensaje}</p>
</div>


);
}

export default Login;
