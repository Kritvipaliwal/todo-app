const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const TASKS_FILE = path.join(__dirname, 'tasks.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Utility: Read tasks from JSON file
function readTasks() {
  try {
    if (!fs.existsSync(TASKS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(TASKS_FILE, 'utf8');
    return JSON.parse(data) || [];
  } catch (error) {
    console.error('Error reading tasks:', error);
    return [];
  }
}

// Utility: Write tasks to JSON file
function writeTasks(tasks) {
  try {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
  } catch (error) {
    console.error('Error writing tasks:', error);
  }
}

// Utility: Generate unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// GET /tasks - Get all tasks
app.get('/api/tasks', (req, res) => {
  try {
    const tasks = readTasks();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve tasks' });
  }
});

// POST /tasks - Add new task
app.post('/api/tasks', (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Task title is required' });
    }

    const tasks = readTasks();
    const newTask = {
      id: generateId(),
      title: title.trim(),
      description: description || '',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    tasks.push(newTask);
    writeTasks(tasks);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT /tasks/:id - Update task
app.put('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    const tasks = readTasks();

    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (title !== undefined && title.trim() === '') {
      return res.status(400).json({ error: 'Task title cannot be empty' });
    }

    if (title !== undefined) tasks[taskIndex].title = title.trim();
    if (description !== undefined) tasks[taskIndex].description = description;
    if (completed !== undefined) tasks[taskIndex].completed = completed;
    tasks[taskIndex].updatedAt = new Date().toISOString();

    writeTasks(tasks);
    res.json(tasks[taskIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE /tasks/:id - Delete task
app.delete('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const tasks = readTasks();

    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const deletedTask = tasks.splice(taskIndex, 1);
    writeTasks(tasks);
    res.json(deletedTask[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Initialize tasks.json if it doesn't exist
if (!fs.existsSync(TASKS_FILE)) {
  writeTasks([]);
}

app.listen(PORT, () => {
  console.log(`✅ To-Do API running on http://localhost:${PORT}`);
  console.log(`📁 Tasks stored in: ${TASKS_FILE}`);
});
