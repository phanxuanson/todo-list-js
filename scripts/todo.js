// Getting access to the elements by their ids using the method
const mainInput = document.getElementById("newTodo");
const todoList = document.querySelector(".todo-list");
const countTodo = document.querySelector(".count-todo strong");
const activeBtn = document.querySelector(".active-todo");
const allBtn = document.querySelector(".all-todo");
const completedBtn = document.querySelector(".completed-todo");
const selectAll = document.querySelector(".check-all");
const clearCompletedBtn = document.querySelector(".clear-completed");
const footer = document.querySelector(".footer");

class TodosApp {
  constructor() {
    // Get data from the this.todos then save data localStorage
    const storageTodos = localStorage.getItem("data");
    const storageIdForTodo = localStorage.getItem("idForTodo");

    if (storageTodos) {
      this.todos = JSON.parse(storageTodos);
      this.idForTodo = parseInt(storageIdForTodo, 10);
    } else {
      this.todos = [];
      this.idForTodo = 0;
      localStorage.setItem("data", JSON.stringify([]));
      localStorage.setItem("idForTodo", 0);
    }

    // Generate localStorage data for a clicked button for feature all, completed, active
    const buttonClicked = localStorage.getItem("buttonClicked");

    // Conditional clicked button for feature
    if (buttonClicked === "active") {
      this.todos = this.getLocalStorage("data").filter(
        (todo) => todo.completed === false
      );
      this.buttonClicked = buttonClicked;
    } else if (buttonClicked === "completed") {
      this.todos = this.getLocalStorage("data").filter(
        (todo) => todo.completed === true
      );
      this.buttonClicked = "";
      localStorage.setItem("buttonClicked", "");
    }
    //
    const clearCompletedData = localStorage.getItem("clearCompletedData");
    this.todos = this.getLocalStorage("data");
    for (let todo = 0; todo < this.todos.length; todo++) {
      if (todo.completed === true) {
        this.clearCompletedData = clearCompletedData;
        clearCompletedBtn.style.display = "block";
      } else if (todo.completed === false) {
        clearCompletedBtn.style.display = "none";
        localStorage.setItem("clearCompletedData", "");
      }
    }
    // if (clearCompletedData) {
    //   // this.todos = this.getLocalStorage('data').filter(todo => todo.completed === true);
    //   this.clearCompletedData = clearCompletedData;
    // } else {
    //   this.todos = this.getLocalStorage('data').filter(todo => todo.completed === false);
    //   this.clearCompletedData = '';
    //   localStorage.setItem('clearCompletedData', '');
    // }

    // Handle event click filter items active
    activeBtn.addEventListener("click", (event) =>
      this.activeTodoListItem(event)
    );

    // Handle event click filter items complete
    completedBtn.addEventListener("click", (event) =>
      this.completedTodoListItem(event)
    );

    // Handle event click all todo item
    allBtn.addEventListener("click", (event) =>
      this.checkAllTodoListItem(event)
    );

    // Handle event select all todo items
    selectAll.addEventListener("click", (event) =>
      this.selectAllTodoListItem(event)
    );

    // Delete all todo items completed
    clearCompletedBtn.addEventListener("click", (event) =>
      this.clearCompleted(event)
    );
  }

  // Get data from localStorage
  getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
  }

  // Create addTodo method
  addTodo() {
    this.idForTodo = this.idForTodo + 1;
    this.todos = this.todos.concat({
      id: this.idForTodo,
      name: mainInput.value,
      completed: false,
    });
  }

  // Display todo list item
  renderTodoList() {
    todoList.innerHTML = "";
    this.todos.forEach((todo) => {
      //Create class for tag li item
      const self = this;
      const todoItem = document.createElement("li");
      todoItem.classList.add("todo-item");

      // Create class for tag input
      const input = document.createElement("input");
      input.classList.add("todo-input-status");
      input.setAttribute("type", "checkbox");

      if (todo.completed) {
        input.setAttribute("checked", "checked");
      }

      input.setAttribute("data_id", todo.id);

      // Create class for tag p
      const p = document.createElement("p");
      p.classList.add("todo-para");
      p.setAttribute("data_id", todo.id);
      p.textContent = todo.name;

      if (todo.completed) {
        p.className = "todo-para completed";
      }

      // Create delete button
      const btnDelete = document.createElement("button");
      btnDelete.classList.add("btn-delete");
      btnDelete.setAttribute("data_id", todo.id);

      todoList.append(todoItem);
      todoItem.append(input, p, btnDelete);

      // Handle event input by enter
      input.addEventListener("click", (event) => this.enterTodoListItem(event));

      // Call handle double click for tag p from edit
      p.addEventListener("dblclick", (event) => this.editTodoListItem(event));

      // Call handle delete item
      btnDelete.addEventListener("click", (event) =>
        this.deleteTodoListItem(event)
      );

      // Call handle click decoration line item
      input.addEventListener("click", (event) =>
        this.changeStatusTodoItem(event)
      );

      // Count item enter
      self.countTodoListItem();
    });

    // Assign event for button enter
    mainInput.addEventListener("keyup", (event) =>
      this.enterTodoListItem(event)
    );
  }

  // Handle the double click enter event when the item value has been enter
  enterTodoListItem(event) {
    this.todos = this.getLocalStorage("data");
    if (event.keyCode === 13 && event.target.value !== "") {
      footer.style.display = 'flex';
      this.addTodo();
      event.target.value = "";
      localStorage.setItem("data", JSON.stringify(this.todos));
      localStorage.setItem("idForTodo", this.idForTodo);
      this.renderTodoList();
    }
  }

  // Edit feature todo list item
  editTodoListItem(event) {
    // Declare variables element
    this.todos = this.getLocalStorage("data");
    const p = event.target;
    const todoItem = event.target.parentNode;
    const todoName = event.target.textContent;
    const todoID = p.getAttribute("data_id");
    const editInput = document.createElement("input");
    editInput.classList.add("edit-input");
    editInput.value = todoName;
    todoItem.replaceChild(editInput, p);
    editInput.addEventListener("keyup", (event) => {
      if (event.keyCode === 13) {
        // Create a map new render list before double click
        this.todos.forEach((todo) => {
          if (todo.id.toString() === todoID) {
            todo.name = editInput.value;
          }
        });
        localStorage.setItem("data", JSON.stringify(this.todos));
        localStorage.setItem("idFooter", this.idFooter);
        this.renderTodoList();
      }
    });
  }

  // Delete feature todo list item
  deleteTodoListItem(event) {
    const btnDelete = event.target;
    const p = event.target.parentNode.querySelector(".todo-para");
    const todoID = p.getAttribute("data_id");
    const index = this.getLocalStorage("data").findIndex((todo) => {
      return todo.id.toString() === todoID;
    });
    this.todos.splice(index, 1);
    btnDelete.parentNode.remove();
    localStorage.setItem("data", JSON.stringify(this.todos));

    // Call countTodoListItem feature in here countdown when deleting item
    this.countTodoListItem();
  }

  // Create a line through mark the job as done
  changeStatusTodoItem(event) {
    const inputStatus =
      event.target.parentNode.querySelector(".todo-input-status");
    const p = event.target.parentNode.querySelector(".todo-para");
    const todoID = p.getAttribute("data_id");
    this.todos = this.getLocalStorage("data");
    this.todos.forEach((todo) => {
      if (todo.id.toString() === todoID) {
        if (inputStatus.checked) {
          todo.completed = true;
          clearCompletedBtn.style.display = "block";
          // selectAll.style.color = '#737373';
        } else {
          todo.completed = false;
          // selectAll.style.color = '#e6e6e6';
          clearCompletedBtn.style.display = "none";
        }
      }
    });
    localStorage.setItem("data", JSON.stringify(this.todos));
    localStorage.setItem("idForTodo", this.idForTodo);
    this.renderTodoList();
  }

  // Count items each time a new item is entered
  countTodoListItem() {
    this.todos = this.getLocalStorage("data");
    countTodo.textContent = this.getLocalStorage("data").filter(
      (todo) => todo.completed === false
    ).length;
  }

  // Filter todo item active
  activeTodoListItem(event) {
    this.todos = this.getLocalStorage("data").filter(
      (todo) => todo.completed === false
    );
    localStorage.setItem("buttonClicked", "active");
    this.renderTodoList();
  }

  // Filter todo item completed
  completedTodoListItem() {
    this.todos = this.getLocalStorage("data").filter(
      (todo) => todo.completed === true
    );
    localStorage.setItem("buttonClicked", "completed");
    this.renderTodoList(todoList);
  }

  // Display todo list item
  checkAllTodoListItem() {
    this.todos = this.getLocalStorage("data");
    localStorage.setItem("buttonClicked", "All");
    this.renderTodoList();
  }

  // Tick checked all todo list items
  selectAllTodoListItem() {
    this.todos = this.getLocalStorage("data");
    this.todos.forEach((todo) => {
      if (selectAll.checked) {
        todo.completed = true;
        clearCompletedBtn.style.display = "block";
      } else {
        todo.completed = false;
        clearCompletedBtn.style.display = "none";
      }
    });

    localStorage.setItem("data", JSON.stringify(this.todos));
    localStorage.setItem("idForTodo", this.idForTodo);
    this.renderTodoList();
  }

  clearCompleted() {
    this.todos = this.getLocalStorage("data");
    this.todos.filter((todo) => {
      todo.completed === false;
      clearCompletedBtn.style.display = "none";
      // footer.style.display = 'none';
    });
    localStorage.setItem("data", JSON.stringify(this.todos));
    this.renderTodoList();
  }
}

// app is brand new object with an empty array of key todo
let app = new TodosApp();

app.renderTodoList();
