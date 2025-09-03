// app.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
app.use(express.json());

const PORT = 3001; // Usaremos un puerto diferente para no chocar con el otro proyecto
const dbPath = './tasks.db';

// Conectar a la base de datos
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error(err.message);
    console.log('Connected to the tasks database.');
});

// --- RUTAS DE LA API ---

// [POST] /tasks - Crear una nueva tarea
app.post('/tasks', (req, res) => {
    const { title, description } = req.body;
    if (!title) {
        return res.status(400).json({ "error": "Title is required." });
    }
    const sql = `INSERT INTO tasks (title, description) VALUES (?, ?)`;
    db.run(sql, [title, description], function(err) {
        if (err) {
            return res.status(400).json({ "error": err.message });
        }
        res.status(201).json({ "message": "Task created", "taskId": this.lastID });
    });
});

// [GET] /tasks - Obtener todas las tareas
app.get('/tasks', (req, res) => {
    db.all(`SELECT * FROM tasks`, [], (err, rows) => {
        if (err) {
            return res.status(400).json({ "error": err.message });
        }
        res.json({ "data": rows });
    });
});

// [PUT] /tasks/:id - Actualizar una tarea (ej: marcar como completada)
app.put('/tasks/:id', (req, res) => {
    const { title, description, status } = req.body;
    const sql = `UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?`;
    db.run(sql, [title, description, status, req.params.id], function(err) {
        if (err) {
            return res.status(400).json({ "error": err.message });
        }
        if (this.changes === 0) {
             return res.status(404).json({ "message": "Task not found" });
        }
        res.json({ "message": "Task updated", "changes": this.changes });
    });
});

// [DELETE] /tasks/:id - Eliminar una tarea
app.delete('/tasks/:id', (req, res) => {
    db.run(`DELETE FROM tasks WHERE id = ?`, req.params.id, function(err) {
        if (err) {
            return res.status(400).json({ "error": err.message });
        }
        if (this.changes === 0) {
             return res.status(404).json({ "message": "Task not found" });
        }
        res.json({ "message": "Task deleted", "changes": this.changes });
    });
});


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Task manager API running on http://localhost:${PORT}`);
});