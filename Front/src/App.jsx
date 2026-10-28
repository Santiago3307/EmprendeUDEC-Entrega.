import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Panel from "./pages/Panel";
import CrearEmprendimiento from "./pages/CrearEmprendimiento";
import api from "./services/api";
import Registro from "./pages/Registro";
import Admin from "./pages/Admin";



function App() {
const [mostrarLogin, setMostrarLogin] = useState(false);
const [emprendimientos, setEmprendimientos] = useState([]);

useEffect(() => {
cargarEmprendimientos();
}, []);

const cargarEmprendimientos = async () => {
try {
const respuesta = await api.get("/emprendimientos");
setEmprendimientos(respuesta.data);
} catch (error) {
console.log(error);
}
};

if (window.location.pathname === "/crear-emprendimiento") {
return <CrearEmprendimiento />;
}
if (window.location.pathname === "/registro") {
  return <Registro />;
}

if (window.location.pathname === "/panel") {
return <Panel />;
}

if (window.location.pathname === "/admin") {
  return <Admin />;
}



return ( <div> <h1>Emprende UDEC</h1>


  <p>
    Plataforma de emprendimientos de la Universidad de Cundinamarca
  </p>

  {!mostrarLogin ? (
    <div>
      <button onClick={() => setMostrarLogin(true)}>
        Iniciar sesión
      </button>

    <button onClick={() => window.location.href = "/registro"}>
  Registrarse
</button>

      <h2>Emprendimientos</h2>

      {emprendimientos.length === 0 ? (
        <p>No hay emprendimientos registrados.</p>
      ) : (
        <div>
          {emprendimientos.map((emprendimiento) => (
            <div key={emprendimiento.EmprendimientoID}>
              <h3>{emprendimiento.Titulo}</h3>

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

              <p>
                <strong>Emprendedor:</strong>{" "}
                {emprendimiento.NombreUsuario}
              </p>

              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  ) : (
    <Login />
  )}
</div>


);
}

export default App;
