// Getting access to the elements by their ids using the method
const mainInput = document.querySelector("#newTodo");
const todoList = document.querySelector(".todo-list");
const countTodo = document.querySelector(".count-todo strong");
const activeBtn = document.querySelector(".active-todo");
const allBtn = document.querySelector(".all-todo");
const completedBtn = document.querySelector(".completed-todo");
const selectAll = document.querySelector(".check-all");

class TodosApp {
  constructor() {
    // Get data from the this.todos then save data localStorage
    const storageTodos = localStorage.getItem("data");
    if (storageTodos) {
      this.todos = JSON.parse(storageTodos);
    } else {
      this.todos = [];
      localStorage.setItem("data", JSON.stringify([]));
    }

    // Generate localStorage data for a clicked button for feature all, completed, active
    const buttonClicked = localStorage.getItem("buttonClicked");
    if (buttonClicked) {
      this.buttonClicked = buttonClicked;
    } else {
      this.buttonClicked = "";
      localStorage.setItem("buttonClicked", "");
    }

    // Conditional clicked button for feature
    if (buttonClicked === "active") {
      this.todos = this.getLocalStorage("data").filter(
        (todo) => todo.completed === false
      );
    } else if (buttonClicked === "completed") {
      this.todos = this.getLocalStorage("data").filter(
        (todo) => todo.completed === true
      );
    }

    // const selectAll = localStorage.getItem('selectAll');
    // if (selectAll === 'checked') {
    // this.todos = this.getLocalStorage('data').forEach(todo => todo.completed === !selectAll);
    // } else if (selectAll === 'unchecked') {
    //   this.todos = this.getLocalStorage('data').forEach(todo => todo.completed === true);
    // }

    // Assign event for button enter
    mainInput.addEventListener("keyup", (event) =>
      this.enterTodoListItem(event)
    );

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
  }

  // Get data from localStorage
  getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
  }

  // Create addTodo method
  addTodo() {
    const id = this.todos.length;
    this.todos = this.todos.concat({
      id: id,
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
  }

  // Handle the double click enter event when the item value has been enter
  enterTodoListItem(event) {
    if (event.keyCode === 13 && event.target.value !== "") {
      this.addTodo();
      this.renderTodoList();
      event.target.value = "";
      localStorage.setItem("data", JSON.stringify(this.todos));
    }
  }

  // Edit feature todo list item
  editTodoListItem(event) {
    // Declare variables element
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
        app.todos.forEach((todo) => {
          if (todo.id.toString() === todoID) {
            todo.name = editInput.value;
          }
        });
        localStorage.setItem("data", JSON.stringify(app.todos));
        app.renderTodoList();
      }
    });
  }

  // Delete feature todo list item
  deleteTodoListItem(event) {
    const btnDelete = event.target;
    const p = event.target.parentNode.querySelector(".todo-para");
    const todoID = p.getAttribute("data_id");

    const index = this.todos.findIndex((todo) => {
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
    const inputStatus = event.target.parentNode.querySelector(".todo-input-status");
    const p = event.target.parentNode.querySelector(".todo-para");
    const todoID = p.getAttribute("data_id");
    this.todos.forEach((todo) => {
      if (todo.id.toString() === todoID) {
        if (inputStatus.checked) {
          todo.completed = true;
          // p.className = "todo-para completed";
        } else {
          todo.completed = false;
          // p.className = "todo-para";
        }
      }
    });
    localStorage.setItem("data", JSON.stringify(this.todos));
    this.renderTodoList();
  }

  // Count items each time a new item is entered
  countTodoListItem() {
    countTodo.textContent = this.getLocalStorage("data").filter(
      (todo) => todo.completed === false
    ).length;
  }

  // Filter todo item active
  activeTodoListItem(event) {
    console.log("Active",event);
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
    this.renderTodoList();
  }

  // Display todo list item
  checkAllTodoListItem() {
    this.todos = this.getLocalStorage("data");
    localStorage.setItem("buttonClicked", "All");
    this.renderTodoList();
  }

  // Tick checked all todo list items
  selectAllTodoListItem(event) {
    console.log('Checked/unchecked',event);
    this.todos.forEach((todo) => (todo.completed = selectAll.checked));
    localStorage.setItem("data", JSON.stringify(this.todos));
    this.renderTodoList();
  }
}

// app is brand new object with an empty array of key todo
let app = new TodosApp();
console.log(app);
app.renderTodoList();
