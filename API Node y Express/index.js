const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

const tasksFile = 'tasks.json';

// Middleware to validate task name
function validateTaskName(req, res, next) {
    if (!req.body.name) {
        return res.status(400).send({ error: 'Task name is required' });
    }
    next();
}

// Helper function to read tasks from JSON file
function readTasks() {
    if (!fs.existsSync(tasksFile)) {
        return [];
    }
    const data = fs.readFileSync(tasksFile);
    return JSON.parse(data);
}

// Helper function to write tasks to JSON file
function writeTasks(tasks) {
    fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));
}

// GET /tasks
app.get('/tasks', (req, res) => {
    const tasks = readTasks();
    res.send(tasks);
});

// POST /tasks
app.post('/tasks', validateTaskName, (req, res) => {
    const tasks = readTasks();
    const newTask = { id: Date.now().toString(), name: req.body.name, status: 'pending' };
    tasks.push(newTask);
    writeTasks(tasks);
    res.status(201).send(newTask);
});

// PUT /tasks/:id
app.put('/tasks/:id', (req, res) => {
    const tasks = readTasks();
    const task = tasks.find(t => t.id === req.params.id);
    if (!task) {
        return res.status(404).send({ error: 'Task not found' });
    }
    task.status = req.body.status || task.status;
    writeTasks(tasks);
    res.send(task);
});

// DELETE /tasks/:id
app.delete('/tasks/:id', (req, res) => {
    let tasks = readTasks();
    tasks = tasks.filter(t => t.id !== req.params.id);
    writeTasks(tasks);
    res.status(204).send();
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



// node index

/*
en postman

GET /tasks

Método: GET
URL: http://localhost:3000/tasks
Descripción: Obtiene todas las tareas.
POST /tasks

Método: POST
URL: http://localhost:3000/tasks
Body (JSON):
Descripción: Agrega una nueva tarea.
PUT /tasks/:id

Método: PUT
URL: http://localhost:3000/tasks/{id}
Body (JSON):
Descripción: Actualiza el estado de una tarea.
DELETE /tasks/:id

Método: DELETE
URL: http://localhost:3000/tasks/{id}
Descripción: Elimina una tarea.

*/

