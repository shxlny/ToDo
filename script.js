const todoInput = document.querySelector('.todo-input');
const addButton = document.querySelector('.add-button');
const todoList = document.querySelector('.todo-list');

document.addEventListener('DOMContentLoaded', () => {
    loadTodosFromStorage();
});

addButton.addEventListener('click', addTodo);

todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

function addTodo() {
    const text = todoInput.value.trim();
    if (!text) return;

    const todo = {
        id: Date.now(),
        text: text,
        completed: false
    };

    createTodoItem(todo);
    saveTodoToStorage(todo);

    todoInput.value = '';
}

function createTodoItem(todo) {
    const li = document.createElement('li');
    li.classList.add('todo-item');
    li.dataset.id = todo.id;

    const span = document.createElement('span');
    span.classList.add('todo-text');
    span.textContent = todo.text;
    if (todo.completed) {
        span.classList.add('completed');
    }

    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('buttons');

    const completeBtn = document.createElement('button');
    completeBtn.classList.add('complete-btn');
    completeBtn.innerHTML = '✔';
    completeBtn.addEventListener('click', toggleComplete);

    const editBtn = document.createElement('button');
    editBtn.classList.add('edit-btn');
    editBtn.innerHTML = '✎';
    editBtn.addEventListener('click', editTodo);

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.innerHTML = '🗑';
    deleteBtn.addEventListener('click', deleteTodo);

    buttonsDiv.appendChild(completeBtn);
    buttonsDiv.appendChild(editBtn);
    buttonsDiv.appendChild(deleteBtn);

    li.appendChild(span);
    li.appendChild(buttonsDiv);

    todoList.appendChild(li);
}

function toggleComplete(e) {
    const listItem = e.target.closest('.todo-item');
    const span = listItem.querySelector('.todo-text');
    span.classList.toggle('completed');

    const id = listItem.dataset.id;
    updateTodoInStorage(id, { completed: span.classList.contains('completed') });
}

function editTodo(e) {
    const listItem = e.target.closest('.todo-item');
    const span = listItem.querySelector('.todo-text');

    const input = document.createElement('input');
    input.type = 'text';
    input.value = span.textContent;
    input.classList.add('todo-input', 'edit-mode');

    listItem.replaceChild(input, span);

    input.focus();
    input.select();

    input.addEventListener('keypress', (evt) => {
        if (evt.key === 'Enter') finishEdit();
    });
    input.addEventListener('blur', finishEdit);

    function finishEdit() {
        const newText = input.value.trim() || 'Без названия';
        span.textContent = newText;
        listItem.replaceChild(span, input);

        const id = listItem.dataset.id;
        updateTodoInStorage(id, { text: newText });
    }
}

function deleteTodo(e) {
    const listItem = e.target.closest('.todo-item');
    const id = listItem.dataset.id;

    listItem.remove();

    removeTodoFromStorage(id);
}

function loadTodosFromStorage() {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.forEach((todo) => createTodoItem(todo));
}

function saveTodoToStorage(todo) {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
}

function updateTodoInStorage(id, updatedData) {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos = todos.map((todo) => {
        if (todo.id == id) {
            return { ...todo, ...updatedData };
        }
        return todo;
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}

function removeTodoFromStorage(id) {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos = todos.filter((todo) => todo.id != id);
    localStorage.setItem('todos', JSON.stringify(todos));
}
