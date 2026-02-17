// ====== API CONFIGURATION ====== 
const API_URL = 'http://localhost:3000/api';

// ====== STATE & ELEMENTS ====== 
let tasks = [];
let currentFilter = 'all';

const elements = {
  taskForm: document.getElementById('taskForm'),
  taskTitle: document.getElementById('taskTitle'),
  taskDescription: document.getElementById('taskDescription'),
  tasksList: document.getElementById('tasksList'),
  filterBtns: document.querySelectorAll('.filter-btn'),
  totalTasks: document.getElementById('totalTasks'),
  remainingTasks: document.getElementById('remainingTasks'),
  completedTasks: document.getElementById('completedTasks'),
  editModal: document.getElementById('editModal'),
  editForm: document.getElementById('editForm'),
  editTitle: document.getElementById('editTitle'),
  editDescription: document.getElementById('editDescription'),
  modalClose: document.querySelector('.modal-close'),
  cancelBtn: document.getElementById('cancelBtn')
};

let editingTaskId = null;

// ====== FETCH TASKS FROM API ====== 
async function fetchTasks() {
  try {
    const response = await fetch(`${API_URL}/tasks`);
    if (!response.ok) throw new Error('Failed to fetch tasks');
    tasks = await response.json();
    renderTasks();
    updateStats();
  } catch (error) {
    console.error('Error fetching tasks:', error);
    showNotification('Failed to load tasks', 'error');
  }
}

// ====== ADD NEW TASK ====== 
async function addTask(title, description) {
  if (!title.trim()) return;

  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description })
    });

    if (!response.ok) throw new Error('Failed to add task');
    const newTask = await response.json();
    tasks.push(newTask);
    renderTasks();
    updateStats();
    elements.taskTitle.value = '';
    elements.taskDescription.value = '';
    showNotification('Task added successfully!', 'success');
  } catch (error) {
    console.error('Error adding task:', error);
    showNotification('Failed to add task', 'error');
  }
}

// ====== DELETE TASK ====== 
async function deleteTask(id) {
  if (!confirm('Are you sure you want to delete this task?')) return;

  try {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error('Failed to delete task');
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
    updateStats();
    showNotification('Task deleted', 'success');
  } catch (error) {
    console.error('Error deleting task:', error);
    showNotification('Failed to delete task', 'error');
  }
}

// ====== TOGGLE TASK COMPLETION ====== 
async function toggleTaskComplete(id, completed) {
  try {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !completed })
    });

    if (!response.ok) throw new Error('Failed to update task');
    const updatedTask = await response.json();
    const taskIndex = tasks.findIndex(t => t.id === id);
    tasks[taskIndex] = updatedTask;
    renderTasks();
    updateStats();
  } catch (error) {
    console.error('Error updating task:', error);
    showNotification('Failed to update task', 'error');
  }
}

// ====== EDIT TASK ====== 
async function editTask(id, title, description) {
  if (!title.trim()) {
    showNotification('Task title cannot be empty', 'error');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description })
    });

    if (!response.ok) throw new Error('Failed to update task');
    const updatedTask = await response.json();
    const taskIndex = tasks.findIndex(t => t.id === id);
    tasks[taskIndex] = updatedTask;
    renderTasks();
    updateStats();
    closeModal();
    showNotification('Task updated!', 'success');
  } catch (error) {
    console.error('Error editing task:', error);
    showNotification('Failed to update task', 'error');
  }
}

// ====== OPEN EDIT MODAL ====== 
function openEditModal(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  editingTaskId = id;
  elements.editTitle.value = task.title;
  elements.editDescription.value = task.description;
  elements.editModal.classList.add('active');
}

// ====== CLOSE EDIT MODAL ====== 
function closeModal() {
  elements.editModal.classList.remove('active');
  editingTaskId = null;
  elements.editForm.reset();
}

// ====== RENDER TASKS ====== 
function renderTasks() {
  const filteredTasks = filterTasks(tasks, currentFilter);

  if (filteredTasks.length === 0) {
    elements.tasksList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📝</div>
        <p class="empty-text">${getEmptyMessage()}</p>
      </div>
    `;
    return;
  }

  elements.tasksList.innerHTML = filteredTasks
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(task => createTaskElement(task))
    .join('');

  attachTaskEvents();
}

// ====== CREATE TASK ELEMENT ====== 
function createTaskElement(task) {
  const date = new Date(task.createdAt);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
    <div class="task-item ${task.completed ? 'completed' : ''}">
      <input
        type="checkbox"
        class="task-checkbox"
        ${task.completed ? 'checked' : ''}
        data-id="${task.id}"
      >
      <div class="task-content">
        <div class="task-title">${escapeHtml(task.title)}</div>
        ${task.description ? `<div class="task-description-text">${escapeHtml(task.description)}</div>` : ''}
        <div class="task-meta">Created: ${formattedDate}</div>
      </div>
      <div class="task-actions">
        <button class="task-btn edit" data-id="${task.id}" title="Edit task">✎</button>
        <button class="task-btn delete" data-id="${task.id}" title="Delete task">🗑</button>
      </div>
    </div>
  `;
}

// ====== FILTER TASKS ====== 
function filterTasks(taskList, filter) {
  switch (filter) {
    case 'completed':
      return taskList.filter(task => task.completed);
    case 'pending':
      return taskList.filter(task => !task.completed);
    case 'all':
    default:
      return taskList;
  }
}

// ====== GET EMPTY MESSAGE ====== 
function getEmptyMessage() {
  const messages = {
    all: 'No tasks yet. Add one to get started!',
    pending: 'All done! No pending tasks.',
    completed: 'No completed tasks yet.'
  };
  return messages[currentFilter] || messages.all;
}

// ====== UPDATE STATS ====== 
function updateStats() {
  const completed = tasks.filter(t => t.completed).length;
  const total = tasks.length;
  const remaining = total - completed;

  elements.totalTasks.textContent = total;
  elements.remainingTasks.textContent = remaining;
  elements.completedTasks.textContent = completed;
}

// ====== SHOW NOTIFICATION ====== 
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-weight: 500;
    z-index: 2000;
    animation: slideInRight 0.3s ease-out;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  `;

  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

// ====== ESCAPE HTML ====== 
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// ====== EVENT LISTENERS ====== 

// Add Task
elements.taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  addTask(elements.taskTitle.value, elements.taskDescription.value);
});

// Filter Buttons
elements.filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    elements.filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

// Attach Dynamic Events
function attachTaskEvents() {
  // Toggle Complete
  document.querySelectorAll('.task-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const task = tasks.find(t => t.id === e.target.dataset.id);
      toggleTaskComplete(e.target.dataset.id, task.completed);
    });
  });

  // Edit Button
  document.querySelectorAll('.task-btn.edit').forEach(btn => {
    btn.addEventListener('click', () => {
      openEditModal(btn.dataset.id);
    });
  });

  // Delete Button
  document.querySelectorAll('.task-btn.delete').forEach(btn => {
    btn.addEventListener('click', () => {
      deleteTask(btn.dataset.id);
    });
  });
}

// Modal Events
elements.editForm.addEventListener('submit', (e) => {
  e.preventDefault();
  editTask(editingTaskId, elements.editTitle.value, elements.editDescription.value);
});

elements.modalClose.addEventListener('click', closeModal);
elements.cancelBtn.addEventListener('click', closeModal);

elements.editModal.addEventListener('click', (e) => {
  if (e.target === elements.editModal) closeModal();
});

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && elements.editModal.classList.contains('active')) {
    closeModal();
  }
});

// ====== INITIAL LOAD ====== 
window.addEventListener('DOMContentLoaded', () => {
  fetchTasks();
});
