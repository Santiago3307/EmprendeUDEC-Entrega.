
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const { sql, poolPromise } = require("./db");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// INICIO
app.get("/", (req, res) => {
    res.send("Servidor Emprende UDEC funcionando");
});

// =====================
// USUARIOS
// =====================

// Consultar usuarios
app.get("/api/usuarios", async (req, res) => {
    try {
        const pool = await poolPromise;
        const resultado = await pool.request().query(`
            SELECT *
            FROM Usuarios
        `);

        res.json(resultado.recordset);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al obtener usuarios");
    }
});

// Registrar usuario
app.post("/api/usuarios", async (req, res) => {
    try {
        const {
            Nombre, Correo, Celular, Contrasena, CodigoPerfil
        } = req.body;

        const pool = await poolPromise;

        const existe = await pool.request()
            .input("Correo", sql.VarChar, Correo)
            .query(`
                SELECT UsuarioID
                FROM Usuarios
                WHERE Correo = @Correo
            `);

        if (existe.recordset.length > 0) {
            return res.status(400).send(
                "Este correo ya está registrado"
            );
        }

        await pool.request()
            .input("Nombre", sql.VarChar, Nombre)
            .input("Correo", sql.VarChar, Correo)
            .input("Celular", sql.VarChar, Celular)
            .input("Contrasena", sql.VarChar, Contrasena)
            .input("CodigoPerfil", sql.VarChar, CodigoPerfil)
            .query(`
                INSERT INTO Usuarios
                (Nombre, Correo, Celular, Contrasena, CodigoPerfil)
                VALUES
                (@Nombre, @Correo, @Celular, @Contrasena, @CodigoPerfil)
            `);

        res.send("Usuario registrado correctamente");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al registrar el usuario");
    }
});

// Editar usuario
app.put("/api/usuarios/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const {
            Nombre, Correo, Celular, Contrasena, CodigoPerfil, Rol
        } = req.body;

        const pool = await poolPromise;

        await pool.request()
            .input("UsuarioID", sql.Int, Number(id))
            .input("Nombre", sql.VarChar, Nombre)
            .input("Correo", sql.VarChar, Correo)
            .input("Celular", sql.VarChar, Celular)
            .input("Contrasena", sql.VarChar, Contrasena)
            .input("CodigoPerfil", sql.VarChar, CodigoPerfil)
            .input("Rol", sql.VarChar, Rol)
            .query(`
                UPDATE Usuarios
                SET Nombre = @Nombre,
                    Correo = @Correo,
                    Celular = @Celular,
                    Contrasena = @Contrasena,
                    CodigoPerfil = @CodigoPerfil,
                    Rol = @Rol
                WHERE UsuarioID = @UsuarioID
            `);

        res.send("Usuario actualizado correctamente");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al actualizar el usuario");
    }
});

// Eliminar usuario
app.delete("/api/usuarios/:id", async (req, res) => {
    try {
        const pool = await poolPromise;

        await pool.request()
            .input("UsuarioID", sql.Int, Number(req.params.id))
            .query(`
                DELETE FROM Usuarios
                WHERE UsuarioID = @UsuarioID
            `);

        res.send("Usuario eliminado correctamente");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al eliminar el usuario");
    }
});

// Inicio de sesión
app.post("/api/login", async (req, res) => {
    try {
        const { Correo, Contrasena } = req.body;
        const pool = await poolPromise;

        const resultado = await pool.request()
            .input("Correo", sql.VarChar, Correo)
            .input("Contrasena", sql.VarChar, Contrasena)
            .query(`
                SELECT UsuarioID, Nombre, Correo, Celular, CodigoPerfil, Rol
                FROM Usuarios
                WHERE Correo = @Correo
                  AND Contrasena = @Contrasena
            `);

        if (resultado.recordset.length === 0) {
            return res.status(401).send(
                "Correo o contraseña incorrectos"
            );
        }

        res.json({
            mensaje: "Inicio de sesión correcto",
            usuario: resultado.recordset[0]
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al iniciar sesión");
    }
});

// =====================
// EMPRENDIMIENTOS
// =====================

// Consultar todos los emprendimientos
app.get("/api/emprendimientos", async (req, res) => {
    try {
        const pool = await poolPromise;

        const resultado = await pool.request().query(`
            SELECT E.EmprendimientoID, E.Titulo, E.Categoria,
                   E.Descripcion, E.Contacto, E.UsuarioID,
                   U.Nombre AS NombreUsuario
            FROM Emprendimientos E
            INNER JOIN Usuarios U ON E.UsuarioID = U.UsuarioID
        `);

        res.json(resultado.recordset);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al obtener emprendimientos");
    }
});

// Consultar emprendimientos de un usuario
app.get("/api/emprendimientos/usuario/:id", async (req, res) => {
    try {
        const pool = await poolPromise;

        const resultado = await pool.request()
            .input("UsuarioID", sql.Int, Number(req.params.id))
            .query(`
                SELECT E.EmprendimientoID, E.Titulo, E.Categoria,
                       E.Descripcion, E.Contacto, E.UsuarioID,
                       U.Nombre AS NombreUsuario
                FROM Emprendimientos E
                INNER JOIN Usuarios U ON E.UsuarioID = U.UsuarioID
                WHERE E.UsuarioID = @UsuarioID
            `);

        res.json(resultado.recordset);
    } catch (error) {
        console.log(error);
        res.status(500).send(
            "Error al obtener los emprendimientos del usuario"
        );
    }
});

// Crear emprendimiento
app.post("/api/emprendimientos", async (req, res) => {
    try {
        const {
            Titulo, Categoria, Descripcion, Contacto, UsuarioID
        } = req.body;

        const pool = await poolPromise;

        const usuario = await pool.request()
            .input("UsuarioID", sql.Int, Number(UsuarioID))
            .query(`
                SELECT UsuarioID
                FROM Usuarios
                WHERE UsuarioID = @UsuarioID
            `);

        if (usuario.recordset.length === 0) {
            return res.status(400).send("El usuario no existe");
        }

        const cantidad = await pool.request()
            .input("UsuarioID", sql.Int, Number(UsuarioID))
            .query(`
                SELECT COUNT(*) AS Cantidad
                FROM Emprendimientos
                WHERE UsuarioID = @UsuarioID
            `);

        if (cantidad.recordset[0].Cantidad >= 10) {
            return res.status(400).send(
                "No puedes tener más de 10 emprendimientos"
            );
        }

        await pool.request()
            .input("Titulo", sql.VarChar, Titulo)
            .input("Categoria", sql.VarChar, Categoria)
            .input("Descripcion", sql.VarChar, Descripcion)
            .input("Contacto", sql.VarChar, Contacto)
            .input("UsuarioID", sql.Int, Number(UsuarioID))
            .query(`
                INSERT INTO Emprendimientos
                (Titulo, Categoria, Descripcion, Contacto, UsuarioID)
                VALUES
                (@Titulo, @Categoria, @Descripcion, @Contacto, @UsuarioID)
            `);

        res.send("Emprendimiento creado correctamente");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al crear el emprendimiento");
    }
});

// Editar emprendimiento
app.put("/api/emprendimientos/:id", async (req, res) => {
    try {
        const {
            Titulo, Categoria, Descripcion, Contacto
        } = req.body;

        const pool = await poolPromise;

        await pool.request()
            .input(
                "EmprendimientoID",
                sql.Int,
                Number(req.params.id)
            )
            .input("Titulo", sql.VarChar, Titulo)
            .input("Categoria", sql.VarChar, Categoria)
            .input("Descripcion", sql.VarChar, Descripcion)
            .input("Contacto", sql.VarChar, Contacto)
            .query(`
                UPDATE Emprendimientos
                SET Titulo = @Titulo,
                    Categoria = @Categoria,
                    Descripcion = @Descripcion,
                    Contacto = @Contacto
                WHERE EmprendimientoID = @EmprendimientoID
            `);

        res.send("Emprendimiento actualizado correctamente");
    } catch (error) {
        console.log(error);
        res.status(500).send(
            "Error al actualizar el emprendimiento"
        );
    }
});

// Eliminar emprendimiento
app.delete("/api/emprendimientos/:id", async (req, res) => {
    try {
        const pool = await poolPromise;

        await pool.request()
            .input(
                "EmprendimientoID",
                sql.Int,
                Number(req.params.id)
            )
            .query(`
                DELETE FROM Emprendimientos
                WHERE EmprendimientoID = @EmprendimientoID
            `);

        res.send("Emprendimiento eliminado correctamente");
    } catch (error) {
        console.log(error);
        res.status(500).send(
            "Error al eliminar el emprendimiento"
        );
    }
});

// Iniciar servidor
const PORT = 3000;


app.listen(PORT, () => {
    console.log(
        `Servidor Emprende UDEC corriendo en http://localhost:${PORT}`
    );
});


