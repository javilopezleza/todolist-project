/*
This script manages a simple to-do list app with features to add, delete, and filter tasks.
 It uses LocalStorage to persist tasks across page reloads and allows filtering by completed or pending tasks.
 It also includes basic UI interactions for task management.
*/

// Wait for the entire page to load before running the script
window.addEventListener("load", () => {
  // DOM element references
  const form = document.getElementById("todo-form");          // Form to add new tasks
  const input = document.getElementById("todo-input");        // Text input for new task
  const list = document.getElementById("todo-list");          // Task list container
  const filterButtons = document.querySelectorAll("#filter button"); // Filter buttons

  // Retrieve tasks from LocalStorage or initialize empty array if none exist
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  // Active filter can be "all", "completed", or "pending"
  let activeFilter = "all";

  // Render tasks based on the active filter
  renderTasks();

  // Handle form submission to add a new task
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent page reload
    const text = input.value.trim(); // Trim whitespace from input
    if (text === "") return; // Do nothing if input is empty

    // Create new task object with unique ID, text, and incomplete status
    const newTask = {
      id: Date.now(),   // Use timestamp as unique ID
      text,
      completed: false
    };

    // Add new task, save to LocalStorage, and re-render list
    tasks.push(newTask);
    saveTasks();
    renderTasks();

    form.reset(); // Clear the input field
  });

  // Add click event listeners to each filter button
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      activeFilter = btn.value; // Set active filter ("all", "completed", "pending")
      renderTasks();            // Update task list based on filter
      updateActiveButton();     // Update button styles to reflect active filter
    });
  });

  // Save the current tasks array to LocalStorage as a JSON string
  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Render tasks in the DOM filtered by the active filter
  function renderTasks() {
    list.innerHTML = ""; // Clear current task list

    tasks
      .filter((task) => {
        // Filter tasks depending on active filter value
        if (activeFilter === "completed") return task.completed;
        if (activeFilter === "pending") return !task.completed;
        return true; // If filter is "all", return all tasks
      })
      .forEach((task) => {
        // Create a list item for each task
        const li = document.createElement("li");
        li.textContent = task.text;
        li.className = task.completed ? "completed" : "";

        // Button to toggle completed/uncompleted state
        const toggleBtn = document.createElement("button");
        toggleBtn.textContent = task.completed ? "Unmark" : "Complete";
        toggleBtn.addEventListener("click", () => {
          task.completed = !task.completed; // Toggle completed state
          saveTasks();
          renderTasks(); // Refresh task list display
        });

        // Button to delete the task
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => {
          // Remove task by filtering it out by ID
          tasks = tasks.filter((t) => t.id !== task.id);
          saveTasks();
          renderTasks();
        });

        // Append buttons to list item and list item to task list
        li.appendChild(toggleBtn);
        li.appendChild(deleteBtn);
        list.appendChild(li);
      });
  }

  // Update the active class on filter buttons to highlight the current filter
  function updateActiveButton() {
    filterButtons.forEach(btn => {
      btn.classList.toggle("active", btn.value === activeFilter);
    });
  }

  // Initialize the active button style on page load
  updateActiveButton();
});