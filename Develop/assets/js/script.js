// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 0;

// Todo: create a function to generate a unique task id
function generateTaskId() {
  nextId = nextId || 0; // Ensure nextId starts at 0 if not in localStorage
  return nextId++;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  return `
    <div class="task-card card mb-3" data-id="${task.id}">
      <div class="card-body">
        <h5 class="card-title">${task.title}</h5>
        <p class="card-text">${task.description}</p>
        <p class="card-text">Due: ${task.dueDate}</p>
        <button class="btn btn-danger btn-sm delete-task">Delete</button>
      </div>
    </div>
  `;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  // Clear all columns before rendering
  $("#todo-cards, #in-progress-cards, #done-cards").empty();

  // Loop through each task and add it to the correct column
  taskList.forEach(function(task) {
    const taskCard = createTaskCard(task);
    if (task.status === "to-do") {
      $("#todo-cards").append(taskCard);
    } else if (task.status === "in-progress") {
      $("#in-progress-cards").append(taskCard);
    } else if (task.status === "done") {
      $("#done-cards").append(taskCard);
    }
  });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();
  
  const title = $("#task-title").val();
  const description = $("#task-description").val();
  const dueDate = $("#task-due-date").val();
  
  const newTask = {
    id: generateTaskId(),
    title: title,
    description: description,
    dueDate: dueDate,
    status: "to-do"
  };

  taskList.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(taskList));
  localStorage.setItem("nextId", JSON.stringify(nextId));

  renderTaskList();
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
  const taskId = $(event.target).closest(".task-card").data("id");

  // Filter out the task with the matching id
  taskList = taskList.filter(task => task.id !== taskId);
  localStorage.setItem("tasks", JSON.stringify(taskList));

  renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  const taskId = ui.draggable.data("id");
  const newStatus = $(this).attr("id");

  const task = taskList.find(task => task.id == taskId);
  task.status = newStatus === "to-do" ? "to-do" : newStatus === "in-progress" ? "in-progress" : "done";

  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  renderTaskList();

  // Event listener for adding a task
  $("#add-task-form").submit(handleAddTask);

  // Make columns droppable
  $(".lane").droppable({
    drop: handleDrop
  });

  // Make task cards draggable
  $(document).on("mouseenter", ".task-card", function () {
    $(this).draggable({
      revert: "invalid",
      helper: "clone"
    });
  });

  // Event listener for deleting a task
  $(document).on("click", ".delete-task", handleDeleteTask);

  // Make the due date field a date picker
  $("#task-due-date").datepicker();
});
