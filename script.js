// We find the form, input box, and list where tasks will go at the end of the codes
const todoForm = document.querySelector('form');
const todoInput = document.getElementById('todo-input');
const todoListUL = document.getElementById('todo-list');

// The next thing is we get our list of tasks from the computer's memory and show them on the browser
let allTodos = getTodos();
updateToDoList();

let editIndex = -1; // This helps us know if we are editing a task or adding a new one

// When the form is submitted, we then decide if we are adding a new task or editing an old one
function submitTodo(e) {
    e.preventDefault(); // This stops the page from reloading
    if (editIndex > -1) {
        updateTodo(); // If we're editing, change the old task we already added
    } else {
        addTodo(); // If not, add a new task we aim to complete
    }
}

// This function adds a new task
function addTodo() {
    const todoText = todoInput.value.trim(); // Get the task text from the input box and remove extra spaces
    if (todoText.length > 0) { // If there's something to add
        const todoObject = {
            text: todoText, // Store the task text
            completed: false // This means the task is not done yet
        }
        allTodos.push(todoObject); // Add the task to our list
        updateToDoList(); // Show the updated list
        saveTodos(); // Save the list in the computer's memory
        todoInput.value = ""; // Clear the input box
    }
}

// This function updates what we see on the screen
function updateToDoList() {
    todoListUL.innerHTML = ""; // Clear the list we see
    allTodos.forEach((todo, todoIndex) => { // For each task in our list
        const todoItem = createTodoItem(todo, todoIndex); // Create a list item
        todoListUL.append(todoItem); // Add the list item to the screen
    });
}

// This function creates a task item to show on the screen
function createTodoItem(todo, todoIndex) {
    const todoId = 'todo-' + todoIndex; // Make a unique ID for each task
    const todoLI = document.createElement("li"); // Make a new list item
    const todoText = todo.text; // Get the task text
    todoLI.className = 'todo'; // Add a class name for styling
    todoLI.innerHTML = `
        <input type="checkbox" name="${todoId}" id="${todoId}"> <!-- A checkbox to mark task as done -->
        <label for="${todoId}" class="custom-checkbox">
            <i class="fa-solid fa-check"></i>
        </label>
        <label for="${todoId}" class="todo-text">
            ${todoText} <!-- Show the task text -->
        </label>
        <button class="delete-button">
            <i class="fa-solid fa-trash"></i>
        </button>
    `;

    const deleteButton = todoLI.querySelector('.delete-button'); // Find the delete button
    deleteButton.addEventListener('click', () => { // When the delete button is clicked
        deleteTodoItem(todoIndex); // Remove the task
    });

    const checkBox = todoLI.querySelector('input'); // Find the checkbox
    checkBox.addEventListener('change', () => { // When the checkbox is clicked
        allTodos[todoIndex].completed = checkBox.checked; // Mark the task as done or not done
        saveTodos(); // Save the changes
    });
    checkBox.checked = todo.completed; // Show if the task is done or not

    const todoTextLabel = todoLI.querySelector('.todo-text'); // Find the task text label
    todoTextLabel.addEventListener('click', () => { // When the task text is clicked
        editTodoItem(todoIndex); // Go to edit mode for the task
    });

    return todoLI; // Return the list item
}

// This function deletes a task
function deleteTodoItem(todoIndex) {
    allTodos = allTodos.filter((_, i) => i !== todoIndex); // Remove the task from the list
    saveTodos(); // Save the changes
    updateToDoList(); // Update what we see on the screen
}

// This function allows us to edit a task
function editTodoItem(todoIndex) {
    const todo = allTodos[todoIndex]; // Get the task we want to edit
    todoInput.value = todo.text; // Put the task text in the input box
    editIndex = todoIndex; // Remember which task we're editing
}

// This function updates a task with new text
function updateTodo() {
    const todoText = todoInput.value.trim(); // Get the new text from the input box
    if (todoText.length > 0) { // If there's something to update
        allTodos[editIndex].text = todoText; // Change the task text
        updateToDoList(); // Update what we see on the screen
        saveTodos(); // Save the changes
        todoInput.value = ""; // Clear the input box
        editIndex = -1; // We're not editing anymore
    }
}

// This function saves the tasks to the computer's memory
function saveTodos() {
    const todosJsonString = JSON.stringify(allTodos); // Turn the list into a string
    localStorage.setItem("todos", todosJsonString); // Save the string in the computer's memory
}

// This function gets the tasks from the computer's memory
function getTodos() {
    const todosJsonParse = localStorage.getItem("todos") || "[]"; // Get the saved tasks or an empty list
    return JSON.parse(todosJsonParse); // Turn the string back into a list
}


// When the form is submitted, call the submitTodo function
todoForm.addEventListener('submit', submitTodo);
