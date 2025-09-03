// database.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./tasks.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the tasks.db SQLite database.');
});

// Crear la tabla 'tasks'
db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'pending'
)`, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Tasks table is ready.');
});

db.close();