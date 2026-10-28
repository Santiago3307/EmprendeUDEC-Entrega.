
import { useEffect, useState } from "react";
import api from "../services/api";

function Admin() {
  const [usuarios, setUsuarios] = useState([]);
  const [emprendimientos, setEmprendimientos] = useState([]);
  
const [editandoUsuario, setEditandoUsuario] = useState(null);
const [Nombre, setNombre] = useState("");
const [Correo, setCorreo] = useState("");
const [Celular, setCelular] = useState("");
const [Contrasena, setContrasena] = useState("");
const [CodigoPerfil, setCodigoPerfil] = useState("");
const [Rol, setRol] = useState("");
const [editandoEmprendimiento, setEditandoEmprendimiento] = useState(null);
const [Titulo, setTitulo] = useState("");
const [Categoria, setCategoria] = useState("");
const [Descripcion, setDescripcion] = useState("");
const [Contacto, setContacto] = useState("");





  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario || usuario.Rol !== "Admin") {
      window.location.href = "/";
      return;
    }

    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const usuariosRespuesta = await api.get("/usuarios");
      const emprendimientosRespuesta = await api.get("/emprendimientos");

      setUsuarios(usuariosRespuesta.data);
      setEmprendimientos(emprendimientosRespuesta.data);
    } catch (error) {
      console.log(error);
    }
  };
const iniciarEdicionUsuario = (usuario) => {
  setEditandoUsuario(usuario.UsuarioID);
  setNombre(usuario.Nombre);
  setCorreo(usuario.Correo);
  setCelular(usuario.Celular);
  setContrasena(usuario.Contrasena);
  setCodigoPerfil(usuario.CodigoPerfil);
  setRol(usuario.Rol);
};

const guardarCambiosUsuario = async (id) => {
  try {
    await api.put("/usuarios/" + id, {
      Nombre,
      Correo,
      Celular,
      Contrasena,
      CodigoPerfil,
      Rol
    });

    setEditandoUsuario(null);
    cargarDatos();
  } catch (error) {
    console.log(error);
  }
};


  
const eliminarUsuario = async (id) => {
  try {
    await api.delete("/usuarios/" + id);

    cargarDatos();
  } catch (error) {
    console.log(error);
  }
};

const eliminarEmprendimiento = async (id) => {
  try {
    await api.delete("/emprendimientos/" + id);

    cargarDatos();
  } catch (error) {
    console.log(error);
  }
};

const iniciarEdicionEmprendimiento = (emprendimiento) => {
  setEditandoEmprendimiento(emprendimiento.EmprendimientoID);
  setTitulo(emprendimiento.Titulo);
  setCategoria(emprendimiento.Categoria);
  setDescripcion(emprendimiento.Descripcion);
  setContacto(emprendimiento.Contacto);
};




const guardarCambiosEmprendimiento = async (id) => {
  try {
    await api.put("/emprendimientos/" + id, {
      Titulo,
      Categoria,
      Descripcion,
      Contacto
    });

    setEditandoEmprendimiento(null);
    cargarDatos();
  } catch (error) {
    console.log(error);
  }
};


  return (
    <div>
      <h1>🔥 PANEL ADMIN NUEVO 🔥</h1>

      <h2>Usuarios</h2>

      {usuarios.map((usuario) => (
        <div key={usuario.UsuarioID}>
          <p>
            <strong>Nombre:</strong> {usuario.Nombre}
          </p>

          <p>
            <strong>Correo:</strong> {usuario.Correo}
          </p>

    
<p>
  <strong>Rol:</strong> {usuario.Rol}
</p>

{editandoUsuario === usuario.UsuarioID && (
  <div>
    <h3>Editar usuario</h3>

    <input
      value={Nombre}
      onChange={(e) => setNombre(e.target.value)}
      placeholder="Nombre"
    />

    <br />
    <br />

    <input
      value={Correo}
      onChange={(e) => setCorreo(e.target.value)}
      placeholder="Correo"
    />

    <br />
    <br />

    <input
      value={Celular}
      onChange={(e) => setCelular(e.target.value)}
      placeholder="Celular"
    />

    <br />
    <br />

    <input
      type="password"
      value={Contrasena}
      onChange={(e) => setContrasena(e.target.value)}
      placeholder="Contraseña"
    />

    <br />
    <br />

    <input
      value={CodigoPerfil}
      onChange={(e) => setCodigoPerfil(e.target.value)}
      placeholder="Código de perfil"
    />

    <br />
    <br />

    <input
      value={Rol}
      onChange={(e) => setRol(e.target.value)}
      placeholder="Rol"
    />

    <br />
    <br />

    <button
      onClick={() => guardarCambiosUsuario(usuario.UsuarioID)}
    >
      Guardar cambios
    </button>

    <button
      onClick={() => setEditandoUsuario(null)}
    >
      Cancelar
    </button>
  </div>
)}


<button
  onClick={() => iniciarEdicionUsuario(usuario)}
>
  Editar
</button>   


<button
  onClick={() => eliminarUsuario(usuario.UsuarioID)}
>
  Eliminar
</button>

<hr />

        </div>
      ))}

      <h2>Emprendimientos</h2>

      {emprendimientos.map((emprendimiento) => (
        <div key={emprendimiento.EmprendimientoID}>
          <p>
            <strong>Título:</strong> {emprendimiento.Titulo}
          </p>

          <p>
            <strong>Categoría:</strong> {emprendimiento.Categoria}
          </p>

          <p>
            <strong>Emprendedor:</strong> {emprendimiento.NombreUsuario}
          </p>
   
<button
  onClick={() => iniciarEdicionEmprendimiento(emprendimiento)}
>
  Editar
</button>



<button
  onClick={() =>
    eliminarEmprendimiento(emprendimiento.EmprendimientoID)
  }
>
  Eliminar
</button>

{editandoEmprendimiento === emprendimiento.EmprendimientoID && (
  <div>
    <h3>Editar emprendimiento</h3>

    <input
      value={Titulo}
      onChange={(e) => setTitulo(e.target.value)}
      placeholder="Título"
    />
    <br /><br />

    <input
      value={Categoria}
      onChange={(e) => setCategoria(e.target.value)}
      placeholder="Categoría"
    />
    <br /><br />

    <textarea
      value={Descripcion}
      onChange={(e) => setDescripcion(e.target.value)}
      placeholder="Descripción"
    />
    <br /><br />

    <input
      value={Contacto}
      onChange={(e) => setContacto(e.target.value)}
      placeholder="Contacto"
    />
    <br /><br />


<button
  onClick={() =>
    guardarCambiosEmprendimiento(emprendimiento.EmprendimientoID)
  }
>
  Guardar cambios
</button>



    <button
      onClick={() => setEditandoEmprendimiento(null)}
    >
      Cancelar
    </button>
  </div>
)}




          <hr />
        </div>
      ))}

      <button
        onClick={() => {
          localStorage.removeItem("usuario");
          window.location.href = "/";
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );
}

export default Admin;

