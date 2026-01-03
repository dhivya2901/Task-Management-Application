const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const SECRET_KEY = 'your_jwt_secret';
app.use(cors());
app.use(express.json());

// DATABASE CONNECTION
const sequelize = new Sequelize('postgresql://postgres:dhivyataskapp@db.pizciwqktiybwxffoqhu.supabase.co:5432/postgres');

// TASK MODEL (Title and Status)
const Task = sequelize.define('Task', {
    title: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: 'Todo' }
});

// JWT MIDDLEWARE
const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send('Access Denied');
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).send('Invalid Token');
        req.user = user;
        next();
    });
};

// REST API ROUTES (CRUD)
app.post('/login', (req, res) => {
    const token = jwt.sign({ email: req.body.email }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});

app.get('/tasks', auth, async (req, res) => {
    const tasks = await Task.findAll();
    res.json(tasks);
});

app.post('/tasks', auth, async (req, res) => {
    // Requirements: Title and Status included
    const task = await Task.create({ title: req.body.title, status: 'Todo' });
    res.json(task);
});

app.put('/tasks/:id', auth, async (req, res) => {
    await Task.update({ status: req.body.status }, { where: { id: req.params.id } });
    res.json({ success: true });
});

app.delete('/tasks/:id', auth, async (req, res) => {
    await Task.destroy({ where: { id: req.params.id } });
    res.json({ success: true });
});

sequelize.sync({ alter: true }).then(() => {
    app.listen(5000, () => console.log('✅ BACKEND LIVE ON 5000'));
});

