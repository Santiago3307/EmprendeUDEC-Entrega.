
import { useEffect, useState } from "react";
import api from "../services/api";

function Panel() {
  const [emprendimientos, setEmprendimientos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [Titulo, setTitulo] = useState("");
  const [Categoria, setCategoria] = useState("");
  const [Descripcion, setDescripcion] = useState("");
  const [Contacto, setContacto] = useState("");

  
useEffect(() => {
  const usuario = localStorage.getItem("usuario");

  if (!usuario) {
    window.location.href = "/";
    return;
  }

  cargarEmprendimientos();
}, []);



  const cargarEmprendimientos = async () => {
    try {
      const usuario = JSON.parse(localStorage.getItem("usuario"));

      const respuesta = await api.get(
        "/emprendimientos/usuario/" + usuario.UsuarioID
      );

      setEmprendimientos(respuesta.data);
    } catch (error) {
      console.log(error);
    }
  };

  const eliminarEmprendimiento = async (id) => {
    try {
      await api.delete("/emprendimientos/" + id);

      cargarEmprendimientos();
    } catch (error) {
      console.log(error);
    }
  };

  const iniciarEdicion = (emprendimiento) => {
    setEditando(emprendimiento.EmprendimientoID);
    setTitulo(emprendimiento.Titulo);
    setCategoria(emprendimiento.Categoria);
    setDescripcion(emprendimiento.Descripcion);
    setContacto(emprendimiento.Contacto);
  };

  const guardarCambios = async (id) => {
    try {
      await api.put("/emprendimientos/" + id, {
        Titulo,
        Categoria,
        Descripcion,
        Contacto
      });

      setEditando(null);
      cargarEmprendimientos();
    } catch (error) {
      console.log(error);
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    window.location.href = "/";
  };

  return (
    <div>
      <h1>Panel de usuario</h1>

      <p>Bienvenido a Emprende UDEC</p>
    
{JSON.parse(localStorage.getItem("usuario"))?.Rol === "Admin" && (
  <button onClick={() => (window.location.href = "/admin")}>
    Panel de Administrador
  </button>
)}




      <h2>Mis emprendimientos</h2>

      {emprendimientos.length === 0 ? (
        <p>No tienes emprendimientos todavía.</p>
      ) : (
        <div>
          {emprendimientos.map((emprendimiento) => (
            <div key={emprendimiento.EmprendimientoID}>
              <h3>{emprendimiento.Titulo}</h3>

              {editando === emprendimiento.EmprendimientoID && (
                <div>
                  <h3>Editar emprendimiento</h3>

                  <input
                    value={Titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Título"
                  />

                  <br />
                  <br />

                  <input
                    value={Categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    placeholder="Categoría"
                  />

                  <br />
                  <br />

                  <textarea
                    value={Descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Descripción"
                  />

                  <br />
                  <br />

                  <input
                    value={Contacto}
                    onChange={(e) => setContacto(e.target.value)}
                    placeholder="Contacto"
                  />

                  <br />
                  <br />

                  <button
                    onClick={() =>
                      guardarCambios(emprendimiento.EmprendimientoID)
                    }
                  >
                    Guardar cambios
                  </button>

                  <button onClick={() => setEditando(null)}>
                    Cancelar
                  </button>
                </div>
              )}

              <p>
                <strong>Categoría:</strong>{" "}
                {emprendimiento.Categoria}
              </p>

              <p>
                <strong>Descripción:</strong>{" "}
                {emprendimiento.Descripcion}
              </p>

              <p>
                <strong>Contacto:</strong>{" "}
                {emprendimiento.Contacto}
              </p>

              <button
                onClick={() => iniciarEdicion(emprendimiento)}
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

              <hr />
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() =>
          (window.location.href = "/crear-emprendimiento")
        }
      >
        Crear emprendimiento
      </button>

      <br />
      <br />

      <button onClick={cerrarSesion}>
        Cerrar sesión
      </button>
    </div>
  );
}

export default Panel;

