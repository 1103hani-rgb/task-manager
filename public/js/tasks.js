const token = localStorage.getItem('token');
const name = localStorage.getItem('name');

if (!token) {
  window.location.href = '/';
}

document.getElementById('welcomeUser').textContent = `👋 ${name}`;

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('name');
  window.location.href = '/';
});

let allTasks = [];
let activeFilter = 'all';

async function loadTasks() {
  try {
    const res = await fetch('/api/tasks', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    allTasks = await res.json();
    renderTasks();
  } 
  catch (err) {
    document.getElementById('tasksList').innerHTML = '<p class="loading">Failed to load tasks.</p>';
  }
}

function renderTasks() {
  const list = document.getElementById('tasksList');
  const filtered = activeFilter === 'all'
    ? allTasks
    : allTasks.filter(t => t.status === activeFilter);
  if (filtered.length === 0) {
    list.innerHTML = '<div class="empty-state"><p>No tasks found.</p></div>';
    return;
  }
  list.innerHTML = filtered.map(task => `
    <div class="task-card ${task.status === 'completed' ? 'completed' : ''}" id="task-${task.id}">
      <div class="task-header">
        <h3 class="task-title">${task.title}</h3>
        <div class="task-badges">
          <span class="badge badge-priority-${task.priority}">${task.priority}</span>
          <span class="badge badge-status-${task.status}">${task.status}</span>
        </div>
      </div>
      ${task.description ? `<p class="task-description">${task.description}</p>` : ''}
      <div class="task-footer">
        <span class="task-due">${task.due_date ? '📅 ' + task.due_date.slice(0, 10) : ''}</span>
        <div class="task-actions">
          <select class="status-select" onchange="updateStatus(${task.id}, this.value)">
            <option value="pending" ${task.status === 'pending' ? 'selected' : ''}>Pending</option>
            <option value="in-progress" ${task.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
            <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Completed</option>
          </select>
          <button class="action-btn delete" onclick="deleteTask(${task.id})">Delete</button>
        </div>
      </div>
    </div>
  `).join('');
}

document.getElementById('addTaskForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const task = {
    title: document.getElementById('taskTitle').value,
    description: document.getElementById('taskDescription').value,
    priority: document.getElementById('taskPriority').value,
    due_date: document.getElementById('taskDueDate').value || null
  };
  try {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(task)
    });
    if (res.ok) {
      document.getElementById('addTaskForm').reset();
      loadTasks();
    }
  } 
  catch (err) {
    console.error(err);
  }
});

async function updateStatus(id, status) {
  try {
    await fetch(`/api/tasks/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    loadTasks();
  } 
  catch (err) {
    console.error(err);
  }
}

async function deleteTask(id) {
  if (!confirm('Are you sure you want to delete this task?')) return;
  try {
    await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    loadTasks();
  } 
  catch (err) {
    console.error(err);
  }
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    renderTasks();
  });
});
loadTasks();