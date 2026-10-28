import { useState } from "react";
import api from "../services/api";

function CrearEmprendimiento() {
const [Titulo, setTitulo] = useState("");
const [Categoria, setCategoria] = useState("");
const [Descripcion, setDescripcion] = useState("");
const [Contacto, setContacto] = useState("");
const [mensaje, setMensaje] = useState("");

const crearEmprendimiento = async (e) => {
e.preventDefault();


const usuario = JSON.parse(localStorage.getItem("usuario"));

try {
  await api.post("/emprendimientos", {
    Titulo,
    Categoria,
    Descripcion,
    Contacto,
    UsuarioID: usuario.UsuarioID
  });

  setMensaje("Emprendimiento creado correctamente");

  setTitulo("");
  setCategoria("");
  setDescripcion("");
  setContacto("");
} catch (error) {
  setMensaje("No se pudo crear el emprendimiento");
}


};

return ( <div> <h1>Crear emprendimiento</h1>


  <form onSubmit={crearEmprendimiento}>
    <div>
      <label>Título</label>
      <br />
      <input
        value={Titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />
    </div>

    <br />

    <div>
      <label>Categoría</label>
      <br />
      <input
        value={Categoria}
        onChange={(e) => setCategoria(e.target.value)}
      />
    </div>

    <br />

    <div>
      <label>Descripción</label>
      <br />
      <textarea
        value={Descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
      />
    </div>

    <br />

    <div>
      <label>Contacto</label>
      <br />
      <input
        value={Contacto}
        onChange={(e) => setContacto(e.target.value)}
      />
    </div>

    <br />

    <button type="submit">Crear emprendimiento</button>
  </form>

  <p>{mensaje}</p>
</div>


);
}

export default CrearEmprendimiento;
