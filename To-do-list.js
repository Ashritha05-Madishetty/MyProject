const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");

// Load tasks when page loads
document.addEventListener("DOMContentLoaded", loadTasks);

// Handle form submit
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const taskText = input.value.trim();
  if (taskText === "") return;

  const now = new Date();
  const formattedDate = now.toLocaleString();

  createTaskElement(taskText, formattedDate, false);
  input.value = "";
  saveTasks();
});

// Create and display task item
function createTaskElement(text, datetime, completed = false) {
  const li = document.createElement("li");
  if (completed) li.classList.add("completed");

  // Task text
  const taskText = document.createElement("span");
  taskText.className = "task-text";
  taskText.textContent = text;

  // Toggle completed
  taskText.addEventListener("click", () => {
    li.classList.toggle("completed");
    saveTasks();
  });

  // Edit task text on double click
  taskText.addEventListener("dblclick", () => {
    const newText = prompt("Edit your task", taskText.textContent);
    if (newText && newText.trim()) {
      taskText.textContent = newText.trim();
      saveTasks();
    }
  });

  // Date & time label
  const dateLabel = document.createElement("span");
  dateLabel.className = "date";
  dateLabel.textContent = `📅 ${datetime}`;
  dateLabel.title = "Click to edit date/time";

  dateLabel.addEventListener("click", () => {
    const input = prompt("Enter new date & time (YYYY-MM-DD HH:mm)", formatDateForInput(datetime));
    const parsed = new Date(input);
    if (!isNaN(parsed)) {
      dateLabel.textContent = `📅 ${parsed.toLocaleString()}`;
      saveTasks();
    } else {
      alert("Invalid date format.");
    }
  });

  // Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => {
    li.remove();
    saveTasks();
  });

  // Append elements to the task item
  li.appendChild(taskText);
  li.appendChild(dateLabel);
  li.appendChild(deleteBtn);
  list.appendChild(li);
}

// Save task list to localStorage
function saveTasks() {
  const tasks = [];
  list.querySelectorAll("li").forEach(li => {
    const text = li.querySelector(".task-text").textContent;
    const dateText = li.querySelector(".date").textContent.replace("📅 ", "");
    const completed = li.classList.contains("completed");
    tasks.push({ text, datetime: dateText, completed });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load task list from localStorage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => createTaskElement(task.text, task.datetime, task.completed));
}

// Format datetime string to prompt-compatible format
function formatDateForInput(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
}
