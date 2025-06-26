window.addEventListener("load", () => {
  const form = document.getElementById("todo-form");
  const input = document.getElementById("todo-input");
  const list = document.getElementById("todo-list");
  const filterButtons = document.querySelectorAll("#filter button");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let activeFilter = "all";

  renderTasks();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (text === "") return;

    const newTask = {
      id: Date.now(),
      text,
      completed: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    form.reset();
  });

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      activeFilter = btn.value;
      renderTasks();
      updateActiveButton();
    });
  });

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function renderTasks() {
    list.innerHTML = "";

    tasks
      .filter((task) => {
        if (activeFilter === "completed") return task.completed;
        if (activeFilter === "pending") return !task.completed;
        return true;
      })
      .forEach((task) => {
        const li = document.createElement("li");
        li.textContent = task.text;
        li.className = task.completed ? "completed" : "";

        const toggleBtn = document.createElement("button");
        toggleBtn.textContent = task.completed ? "Desmarcar" : "Completar";
        toggleBtn.addEventListener("click", () => {
          task.completed = !task.completed;
          saveTasks();
          renderTasks();
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Eliminar";
        deleteBtn.addEventListener("click", () => {
          tasks = tasks.filter((t) => t.id !== task.id);
          saveTasks();
          renderTasks();
        });

        li.appendChild(toggleBtn);
        li.appendChild(deleteBtn);
        list.appendChild(li);
      });
  }

  function updateActiveButton() {
    filterButtons.forEach(btn => {
      btn.classList.toggle("active", btn.value === activeFilter);
    });
  }

  updateActiveButton();
});
