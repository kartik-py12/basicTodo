let dragItems = document.querySelectorAll(".drag");
let contentTodo = document.querySelector(".content_todo");
let contentIP = document.querySelector(".content_ip");
let contentUR = document.querySelector(".content_ur");
let contentF = document.querySelector(".content_f");
let tform=document.querySelector("#tform");
let ipt=document.querySelector("#ipt");
let urt=document.querySelector("#urt");
let fform=document.querySelector("#fform");


let addNewButtons = document.querySelectorAll(".new_todo");
// console.log(addNewButtons[0])
let heading = document.querySelector(".heading");

const popups = document.querySelectorAll(".form");
const submitButton = document.querySelector(".submit");


// if(addNewButtons[1]){
//   toggleForm(popups[1])
// }


// Toggle form visibility
function toggleForm(id) {
  const form = document.querySelector(`#${id}`);
  form.classList.toggle("hidden");
  console.log("receivedf at toggle");
}
// Load To-Do items from local storage when the page is loaded
function loadTodos() {
  const todoData = JSON.parse(localStorage.getItem("todos")) || {};

  for (const [key, todos] of Object.entries(todoData)) {
    const contentDiv = document.querySelector(`.${key}`);
    todos.forEach(todo => {
      const newTodo = document.createElement("div");
      newTodo.classList.add("drag");
      newTodo.setAttribute("draggable", "true");
      newTodo.dataset.section = key; // Store the section it belongs to
      newTodo.innerHTML = `
        <p style="font-weight:bolder; font-size: 20px;">${todo.title}</p>
        <p style="color: rgb(147, 145, 145); font-weight: 600; margin-top:10px; overflow:auto">${todo.description}</p>
        <div class="extra" style="display: flex; margin-top: 20px; justify-content: left; align-items: center;">
          <div style="background-color: orange; color: white; font-weight: 600; width: max-content; border-radius: 20px; padding: 5px 10px; margin-right: 8px;">${todo.tag}</div>
          <div style="color: rgb(147, 145, 145); font-weight:600; margin-right: 60px;">
            ${todo.date}
          </div>
          <div style="color: rgb(147, 145, 145); font-weight: 600;">Just now</div>
        </div>
        <button class="delete-btn" >🗑️</button>
      `;
      contentDiv.appendChild(newTodo);
      addDragAndDrop(newTodo); // Add drag-and-drop functionality
      addDeleteFunctionality(newTodo); // Add delete functionality
    });
  }
}

// Function to dynamically add To-Do item
function addTodo(id, d, num) {
  const title = document.getElementById(`title${num}`).value;
  const description = document.getElementById(`description${num}`).value;
  const tag = document.getElementById(`tag${num}`).value;
  let dd = document.querySelector(`.${d}`);

  // Validate input
  if (!title || !description || !tag) {
    alert("Please fill in all fields.");
    return;
  }

  const newTodo = {
    title: title,
    description: description,
    tag: tag,
    date: new Date().toLocaleDateString()
  };

  // Get current todos from local storage
  const todoData = JSON.parse(localStorage.getItem("todos")) || {};
  if (!todoData[d]) {
    todoData[d] = [];
  }
  todoData[d].push(newTodo);

  // Save updated todos to local storage
  localStorage.setItem("todos", JSON.stringify(todoData));

  // Create and append the new To-Do element
  const todoElement = document.createElement("div");
  todoElement.classList.add("drag");
  todoElement.setAttribute("draggable", "true");
  todoElement.dataset.section = d; // Store the section it belongs to
  todoElement.innerHTML = `
    <p style="font-weight:bolder; font-size: 20px;">${newTodo.title}</p>
    <p style="color: rgb(147, 145, 145); font-weight: 600; margin-top:10px;">${newTodo.description}</p>
    <div class="extra" style="display: flex; margin-top: 20px; justify-content: left; align-items: center;">
      <div style="background-color: orange; color: white; font-weight: 600; width: max-content; border-radius: 20px; padding: 5px 10px; margin-right: 8px;">${newTodo.tag}</div>
      <div style="color: rgb(147, 145, 145); font-weight:600; margin-right: 60px;">
        ${newTodo.date}
      </div>
      <div style="color: rgb(147, 145, 145); font-weight: 600;">Just now</div>
    </div>
    <button class="delete-btn" style="margin-top: 10px;">🗑️</button>
  `;
  dd.appendChild(todoElement);
  addDragAndDrop(todoElement); // Apply drag-and-drop to the new element
  addDeleteFunctionality(todoElement); // Apply delete functionality

  // Clear the form
  document.getElementById(`title${num}`).value = '';
  document.getElementById(`description${num}`).value = '';
  document.getElementById(`tag${num}`).value = '';

  // Hide the form
  toggleForm(id);
}

// Function to add drag-and-drop functionality
function addDragAndDrop(dragElement) {
  dragElement.addEventListener("dragstart", function (e) {
    let selected = e.target;

    [contentTodo, contentIP, contentUR, contentF].forEach((section) => {
      section.addEventListener("dragover", (e) => e.preventDefault());

      section.addEventListener("drop", () => {
        section.appendChild(selected);

        // Update the section of the To-Do item in local storage
        updateTodoSection(selected, section.className);
        selected = null;
      });
    });
  });
}

// Function to add delete functionality
function addDeleteFunctionality(todoElement) {
  const deleteButton = todoElement.querySelector(".delete-btn");
  deleteButton.addEventListener("click", () => {
    const section = todoElement.dataset.section;

    // Remove from DOM
    todoElement.remove();

    // Remove from local storage
    const todoData = JSON.parse(localStorage.getItem("todos")) || {};
    todoData[section] = todoData[section].filter(todo => todo.title !== todoElement.querySelector("p").textContent);

    // Save updated data to local storage
    localStorage.setItem("todos", JSON.stringify(todoData));
  });
}

// Update the section of the To-Do item in local storage
function updateTodoSection(todoElement, newSection) {
  const todoData = JSON.parse(localStorage.getItem("todos")) || {};
  const oldSection = todoElement.dataset.section;

  // Find the To-Do item in the old section and move it to the new section
  const todoIndex = todoData[oldSection].findIndex(todo => todo.title === todoElement.querySelector("p").textContent);
  if (todoIndex !== -1) {
    const todo = todoData[oldSection].splice(todoIndex, 1)[0]; // Remove from old section
    if (!todoData[newSection]) {
      todoData[newSection] = [];
    }
    todoData[newSection].push(todo); // Add to new section
  }

  // Save updated todos to local storage
  localStorage.setItem("todos", JSON.stringify(todoData));

  // Update the data-section attribute
  todoElement.dataset.section = newSection;
}

// Call loadTodos to display saved todos when the page loads
document.addEventListener("DOMContentLoaded", loadTodos);
