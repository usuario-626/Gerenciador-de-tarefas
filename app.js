"use strict"

console.log("Iniciado com sucesso");

document.addEventListener("DOMContentLoaded", function () {

  console.log("Página carregada");

});

const taskForm = document.getElementById("taskForm");
const taskName = document.getElementById("taskName");
const taskPriority = document.getElementById("taskPriority");
const taskList = document.getElementById("taskList");
const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");
const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = [];

try { tasks = JSON.parse(localStorage.getItem("webproject_tasks")) || [];

    if (!Array.isArray(tasks)) {
      tasks = [];
    }
  }

  catch (error) {
  tasks = [];
}

let currentFilter = "all";

function saveTasks() {
  localStorage.setItem(
    "webproject_tasks",
    JSON.stringify(tasks)
  );
}


function updateStatistics() {

  const total = tasks.length;

  const completed = tasks.filter(
    task => task.completed
  ).length;

  const pending = total - completed;

  totalTasks.textContent = total;
  pendingTasks.textContent = pending;
  completedTasks.textContent = completed;
}


function createTaskElement(task) {

  const taskItem = document.createElement("article");
  taskItem.className = "task-item";

    if (task.completed) {
      taskItem.classList.add("completed");
    }

  const taskInfo = document.createElement("div");
    taskInfo.className = "task-info";

  const title = document.createElement("h3");
    title.textContent = task.name;

  const description = document.createElement("p");

  description.textContent =
    "Prioridade: " + task.priority;

  const status = document.createElement("p");

  status.textContent = task.completed
    ? "Status: Concluída"
    : "Status: Pendente";

  taskInfo.appendChild(title);
  taskInfo.appendChild(description);
  taskInfo.appendChild(status);

  const actions = document.createElement("div");
    actions.className = "task-actions";

  const completeButton = document.createElement("button");

    completeButton.type = "button";
    completeButton.className = "complete-btn";
    completeButton.textContent = task.completed
    ? "Reabrir" : "Concluir";
    completeButton.dataset.action = "toggle";
    completeButton.dataset.id = task.id;

  const deleteButton = document.createElement("button");

    deleteButton.type = "button";
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Excluir";

    deleteButton.dataset.action = "delete";
    deleteButton.dataset.id = task.id;

    actions.appendChild(completeButton);
    actions.appendChild(deleteButton);

    taskItem.appendChild(taskInfo);
    taskItem.appendChild(actions);

  return taskItem;
}


function renderTasks() {

    taskList.replaceChildren();

    let filteredTasks = tasks;

    if (currentFilter === "pending") {
        filteredTasks = tasks.filter(
          task => !task.completed
        );
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(
          task => task.completed
        );
    }

    if (filteredTasks.length === 0) {

      const message = document.createElement("p");
      message.className = "empty-message";

        message.textContent = tasks.length === 0
            ? "Nenhuma tarefa cadastrada."
            : "Nenhuma tarefa encontrada neste filtro.";

        taskList.appendChild(message);
      }
      
      else {

        filteredTasks.forEach(task => {
            taskList.appendChild(
                createTaskElement(task)
            );
        });
    }
    updateStatistics();
}


taskForm.addEventListener("submit", function(event) {

  event.preventDefault();

    const name = taskName.value.trim();
    const priority = taskPriority.value;

    if (name === "") {
        alert("Digite o nome da tarefa.");
        return;
    }

    const newTask = {
        id: crypto.randomUUID(),
        name: name,
        priority: priority,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();
    currentFilter = "all";
    updateActiveFilter();
    renderTasks();
    taskForm.reset();
    taskName.focus();
  }
);


function toggleTask(id) {

  tasks = tasks.map(task => {
    if (task.id === id) {
        return {
          ...task,
          completed: !task.completed
        };
      }
      return task;
    });

  saveTasks();
  renderTasks();
}


function deleteTask(id) {

  const confirmation = confirm(
    "Deseja excluir esta tarefa?"
  );

    if (!confirmation) {
      return;
    }

    tasks = tasks.filter(
      task => task.id !== id
    );

  saveTasks();
  renderTasks();
}


taskList.addEventListener("click", function(event) {

    const button = event.target.closest("button");

    if (!button) {
      return;
    }

    const id = button.dataset.id;
    const action = button.dataset.action;

    if (action === "toggle") {
      toggleTask(id);
    }

    if (action === "delete") {
      deleteTask(id);
    }
  }
);

function updateActiveFilter() {

  filterButtons.forEach(button => {

    const isActive =
      button.dataset.filter === currentFilter;

      button.classList.toggle("active", isActive);

      button.setAttribute(
        "aria-pressed",
        String(isActive)
    );

  });

}

filterButtons.forEach(button => {

  button.addEventListener("click", function() {

    currentFilter = button.dataset.filter;

      updateActiveFilter();
      renderTasks();

  });

});


