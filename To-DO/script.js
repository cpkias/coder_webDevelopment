// This file contains the JavaScript code that implements the functionality of the To-Do List app.

let taskList = [];

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskValue = taskInput.value.trim();

    if (taskValue) {
        taskList.push(taskValue);
        taskInput.value = '';
        renderTasks();
    }
}

function removeTask(index) {
    taskList.splice(index, 1);
    renderTasks();
}

function renderTasks() {
    const taskListElement = document.getElementById('taskList');
    taskListElement.innerHTML = '';

    taskList.forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = task;

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.className = 'remove-task';
        removeButton.onclick = () => removeTask(index);

        li.appendChild(removeButton);
        taskListElement.appendChild(li);
    });
}