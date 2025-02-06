const express = require('express');
const app = express();
const port = 3050;
const sql = require('mssql');

// Conexión a la base de datos MySQL

const dbConfig = {
    user: 'andreybd', // 
    password: 'TallerNode2025', 
    server: 'tiusr11pl.cuc-carrera-ti.ac.cr', 
    database: 'base_talleres_1', 
    options: {
      encrypt: false,
      trustServerCertificate: true
    }
  };

  const poolPromise = new sql.ConnectionPool(dbConfig)
  .connect()
  .then(pool => {
      console.log('Conexión a SQL Server exitosa');
      return pool;
  })
  .catch(err => {
      console.error('Error en la conexión:', err);
  });

// Ruta para obtener el animal según el mes
app.get('/getAnimal/:mes', async (req, res) => {
    try {
        const mes = req.params.mes;
        const pool = await poolPromise; // Esperar la conexión
        const result = await pool
            .request()
            .input('mes', sql.Int, mes) // Evita SQL Injection
            .query('SELECT animal FROM animales WHERE mes = @mes');

        if (result.recordset.length > 0) {
            res.json({ animal: result.recordset[0].animal });
        } else {
            res.status(404).json({ animal: null });
        }
    } catch (err) {
        console.error('Error al consultar animales:', err);
        res.status(500).json({ error: 'Error al obtener el animal' });
    }
});


// Obtener frase motivacional según el día
app.get('/getFrase/:dia', async (req, res) => {
    try {
        const dia = req.params.dia;
        const pool = await poolPromise; // Esperar la conexión a SQL Server
        const result = await pool
            .request()
            .input('dia', sql.Int, dia) // Parámetro seguro contra inyección SQL
            .query('SELECT frase FROM frases WHERE dia = @dia');

        if (result.recordset.length > 0) {
            res.json({ frase: result.recordset[0].frase });
        } else {
            res.status(404).json({ frase: null });
        }
    } catch (err) {
        console.error('Error al consultar frases:', err);
        res.status(500).json({ error: 'Error al obtener la frase' });
    }
});


// Obtener palabra para el juego
app.get('/getPalabra', (req, res) => {
    db.query('SELECT palabra FROM palabras ORDER BY RAND() LIMIT 1', (err, result) => {
        if (err) {
            console.error('Error al consultar palabras:', err);
            return res.status(500).json({ error: 'Error al obtener la palabra' });
        }
        if (result.length > 0) {
            res.json({ palabra: result[0].palabra });
        } else {
            res.status(404).json({ palabra: null });
        }
    });
});

//Incrementar el conteo de visitas 
async function incrementarContador() {
    try {
        const pool = await poolPromise; // Obtener el pool de conexiones
        const query = `UPDATE Visitas SET contador = contador + 1`;
        await pool.request().query(query); // Usar el pool para ejecutar la consulta
        console.log('Contador incrementado');
    } catch (err) {
        console.error('Error al incrementar el contador:', err);
        throw err; // Lanzar el error para que pueda ser manejado en otro lugar
    }
}

//Obtener el contador de visitas 
async function obtenerContador() {
    try {
        const pool = await poolPromise; // Obtener el pool de conexiones
        const query = `SELECT contador FROM Visitas`;
        const result = await pool.request().query(query); // Usar el pool para ejecutar la consulta
        return result.recordset[0].contador;
    } catch (err) {
        console.error('Error al obtener el contador:', err);
        throw err; // Lanzar el error para que pueda ser manejado en otro lugar
    }
}

// Endpoint para contar visitas
app.get('/visitas', async (req, res) => {
    try {
        await incrementarContador(); // Incrementar el contador
        const contador = await obtenerContador(); // Obtener el contador actual
        res.send(`¡Hola! Esta página ha sido visitada ${contador} veces.`);
    } catch (err) {
        res.status(500).send('Error en el servidor');
    }
});

// Obtener palabra aleatoria para el juego
app.get('/getPalabraAleatoria', async (req, res) => {
    try {
        const pool = await poolPromise; 
        const result = await pool
            .request()
            .query('SELECT TOP 1 palabra FROM palabras ORDER BY NEWID()'); 

        if (result.recordset.length > 0) {
            res.json({ palabra: result.recordset[0].palabra });
        } else {
            res.status(404).json({ palabra: null });
        }
    } catch (err) {
        console.error('Error al consultar palabras:', err);
        res.status(500).json({ error: 'Error al obtener la palabra' });
    }
});

// Servir archivos estáticos (HTML, CSS, JS)
app.use(express.static('public'));

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});