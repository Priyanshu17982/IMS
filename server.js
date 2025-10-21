const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Initialize SQLite database
const db = new sqlite3.Database('inventory.db', (err) => {
    if (err) console.error(err.message);
    else console.log('Connected to SQLite database.');
});

// Create table if it doesn't exist
db.run(`
    CREATE TABLE IF NOT EXISTS inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL
    )
`);

// API routes

// Get all items
app.get('/items', (req, res) => {
    db.all("SELECT * FROM inventory", [], (err, rows) => {
        if (err) res.status(400).json({ error: err.message });
        else res.json(rows);
    });
});

// Add item
app.post('/add_item', (req, res) => {
    const { item_name, quantity, price } = req.body;
    db.run(
        "INSERT INTO inventory (item_name, quantity, price) VALUES (?, ?, ?)",
        [item_name, quantity, price],
        function(err) {
            if (err) res.status(400).json({ error: err.message });
            else res.json({ status: 'success', id: this.lastID });
        }
    );
});

// Update item
app.put('/update_item/:id', (req, res) => {
    const { id } = req.params;
    const { item_name, quantity, price } = req.body;
    db.run(
        "UPDATE inventory SET item_name=?, quantity=?, price=? WHERE id=?",
        [item_name, quantity, price, id],
        function(err) {
            if (err) res.status(400).json({ error: err.message });
            else res.json({ status: 'success' });
        }
    );
});

// Delete item
app.delete('/delete_item/:id', (req, res) => {
    const { id } = req.params;
    db.run(
        "DELETE FROM inventory WHERE id=?",
        [id],
        function(err) {
            if (err) res.status(400).json({ error: err.message });
            else res.json({ status: 'success' });
        }
    );
});

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
