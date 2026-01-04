// DOM ELEMENTS - Store references to all HTML elements
const els = {
  form: document.getElementById('taskForm'),
  title: document.getElementById('taskTitle'),
  desc: document.getElementById('taskDescription'),
  date: document.getElementById('taskDate'),
  status: document.getElementById('taskStatus'),
  container: document.getElementById('tasksContainer'),
  count: document.getElementById('taskCount'),
  titleErr: document.getElementById('titleError'),
  dateErr: document.getElementById('dateError')
};

const STORAGE_KEY = 'dailyActivityTracker';

// SVG Delete Icon
const DELETE_ICON = `
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.5 5.5C5.77614 5.5 6 5.72386 6 6V12C6 12.2761 5.77614 12.5 5.5 12.5C5.22386 12.5 5 12.2761 5 12V6C5 5.72386 5.22386 5.5 5.5 5.5Z" fill="currentColor"/>
        <path d="M8 5.5C8.27614 5.5 8.5 5.72386 8.5 6V12C8.5 12.2761 8.27614 12.5 8 12.5C7.72386 12.5 7.5 12.2761 7.5 12V6C7.5 5.72386 7.72386 5.5 8 5.5Z" fill="currentColor"/>
        <path d="M11 6C11 5.72386 10.7761 5.5 10.5 5.5C10.2239 5.5 10 5.72386 10 6V12C10 12.2761 10.2239 12.5 10.5 12.5C10.7761 12.5 11 12.2761 11 12V6Z" fill="currentColor"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 2C11.3284 2 12 2.67157 12 3.5V4H13.5C13.7761 4 14 4.22386 14 4.5C14 4.77614 13.7761 5 13.5 5H13V13.5C13 14.3284 12.3284 15 11.5 15H4.5C3.67157 15 3 14.3284 3 13.5V5H2.5C2.22386 5 2 4.77614 2 4.5C2 4.22386 2.22386 4 2.5 4H4V3.5C4 2.67157 4.67157 2 5.5 2H10.5ZM5 3.5V4H11V3.5C11 3.22386 10.7761 3 10.5 3H5.5C5.22386 3 5 3.22386 5 3.5ZM4 5V13.5C4 13.7761 4.22386 14 4.5 14H11.5C11.7761 14 12 13.7761 12 13.5V5H4Z" fill="currentColor"/>
    </svg>
`;

// STORAGE FUNCTIONS - Handle saving and retrieving tasks from browser storage
const getTasks = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
const saveTasks = tasks => localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));

// ERROR HANDLING
const clearErrors = () => {
  els.titleErr.textContent = '';
  els.dateErr.textContent = '';
  els.title.style.borderColor = '#ccc';
  els.date.style.borderColor = '#ccc';
};

// INITIALIZATION - Set up app when page loads
document.addEventListener('DOMContentLoaded', () => {
  els.date.value = new Date().toISOString().split('T')[0];
  loadTasks();
});

// TASK DISPLAY - Load and render all tasks from storage
function loadTasks() {
  const tasks = getTasks();
  els.container.innerHTML = '';
  tasks.forEach((task, index) => els.container.appendChild(createTask(task, index)));
  els.count.textContent = tasks.length ? `Tasks: ${tasks.length}` : '';
}

// TASK CREATION - Build HTML element for a single task
function createTask(task, index) {
  const div = document.createElement('div');
  div.className = 'task-item';
  
  const date = new Date(task.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
  });
  const statusClass = task.status.replace(' ', '-');
  
  div.innerHTML = `
      <div class="task-content">
          <div class="task-title"></div>
          ${task.description?.trim() ? '<div class="task-description"></div>' : ''}
          <div class="task-meta">
              <div class="task-date"><strong>Date:</strong> ${date}</div>
              <div class="task-status-container">
                  <label for="status-${index}">Status:</label>
                  <select class="task-status ${statusClass}" id="status-${index}">
                      ${['planned', 'in progress', 'completed'].map(s => 
                          `<option value="${s}" ${s === task.status ? 'selected' : ''}>${s.charAt(0).toUpperCase() + s.slice(1)}</option>`
                      ).join('')}
                  </select>
              </div>
          </div>
      </div>
      <div class="task-actions">
          <button class="delete-btn" aria-label="Delete">${DELETE_ICON}</button>
      </div>
  `;
  
  div.querySelector('.task-title').textContent = task.title;
  if (task.description?.trim()) {
      div.querySelector('.task-description').textContent = task.description;
  }
  
  // Event listener for status changes
  div.querySelector('select').addEventListener('change', (e) => {
      const tasks = getTasks();
      tasks[index].status = e.target.value;
      saveTasks(tasks);
      loadTasks();
  });
  
  // Event listener for task deletion
  div.querySelector('.delete-btn').addEventListener('click', () => {
      const tasks = getTasks();
      tasks.splice(index, 1);
      saveTasks(tasks);
      loadTasks();
  });
  
  return div;
}

// FORM VALIDATION - Check if form inputs are valid before submission
function validate() {
  clearErrors();
  let valid = true;
  
  if (!els.title.value.trim()) {
      els.titleErr.textContent = 'Task title is required';
      els.title.style.borderColor = '#e74c3c';
      valid = false;
  }
  
  if (!els.date.value) {
      els.dateErr.textContent = 'Date is required';
      els.date.style.borderColor = '#e74c3c';
      valid = false;
  }
  
  return valid;
}

// FORM SUBMISSION - Handle when user submits the form to add a task
els.form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validate()) return;
  
  const tasks = getTasks();
  tasks.push({
      id: Date.now(),
      title: els.title.value.trim(),
      description: els.desc.value.trim(),
      date: els.date.value,
      status: els.status.value
  });
  
  saveTasks(tasks);
  els.title.value = '';
  els.desc.value = '';
  els.status.value = 'planned';
  els.date.value = new Date().toISOString().split('T')[0];
  clearErrors();
  loadTasks();
});

// REAL-TIME VALIDATION - Provide immediate feedback as user types/interacts
els.title.addEventListener('blur', () => {
  if (!els.title.value.trim()) {
      els.titleErr.textContent = 'Task title is required';
      els.title.style.borderColor = '#e74c3c';
  } else {
      clearErrors();
  }
});

els.title.addEventListener('input', () => {
  if (els.title.value.trim()) clearErrors();
});

els.date.addEventListener('change', () => {
  if (els.date.value) {
      clearErrors();
  } else {
      els.dateErr.textContent = 'Date is required';
      els.date.style.borderColor = '#e74c3c';
  }
});