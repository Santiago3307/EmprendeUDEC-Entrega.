import { useState } from "react";
import api from "../services/api";

function Registro() {
const [Nombre, setNombre] = useState("");
const [Correo, setCorreo] = useState("");
const [Celular, setCelular] = useState("");
const [Contrasena, setContrasena] = useState("");
const [CodigoPerfil, setCodigoPerfil] = useState("");
const [mensaje, setMensaje] = useState("");

const registrarUsuario = async (e) => {
e.preventDefault();


try {
  await api.post("/usuarios", {
    Nombre,
    Correo,
    Celular,
    Contrasena,
    CodigoPerfil
  });

  setMensaje("Usuario registrado correctamente");

  setNombre("");
  setCorreo("");
  setCelular("");
  setContrasena("");
  setCodigoPerfil("");
} catch (error) {
  setMensaje("No se pudo registrar el usuario");
}


};

return ( <div> <h1>Crear cuenta</h1>


  <form onSubmit={registrarUsuario}>
    <div>
      <label>Nombre</label>
      <br />
      <input
        value={Nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
    </div>

    <br />

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
      <label>Celular</label>
      <br />
      <input
        value={Celular}
        onChange={(e) => setCelular(e.target.value)}
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

    <div>
      <label>Código de perfil</label>
      <br />
      <input
        value={CodigoPerfil}
        onChange={(e) => setCodigoPerfil(e.target.value)}
      />
    </div>

    <br />

    <button type="submit">Registrarse</button>
  </form>

  <p>{mensaje}</p>
</div>


);
}

export default Registro;
