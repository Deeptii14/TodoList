const todoinputElement = document.getElementById("task-detail");
const todobtn = document.getElementById("add-todo");
const userName = document.getElementById("username");

const user = prompt("Enter your Name:-");
userName.innerText = user;

getallTodos();

todobtn.addEventListener("click", function () {
  const todovalue = todoinputElement.value;
  if (todovalue) {
    saveTodo(todovalue, function (error) {
      if (error) {
        alert(error);
      } else {
        addTodoDom(todovalue);
      }
    });
  } else {
    alert("Please enter a todo..");
  }
});

//save todo function which send entry of todo to backend
function saveTodo(value, callback) {
  fetch("/create-todo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: value, createdBy: user }),
  }).then(function (response) {
    if (response.status === 200) {
      callback();
    } else {
      callback("OOps! Post request to create todo failed in backend!");
    }
  });
}

//add todo to dom i.e. UI entry
function addTodoDom(value) {
  const displaytodo = document.getElementById("displaytasks");
  const newtodocontainer = document.createElement("div");
  const taskvalue = document.createElement("div");
  taskvalue.innerText = value;
  const btndiv = document.createElement("div");
  var checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("checkbox-btn");
  checkbox.addEventListener("change", function () {
    if (checkbox.checked) {
      taskvalue.style.textDecoration = "line-through";
    } else {
      taskvalue.style.textDecoration = "none";
    }
  });
  var deletebtn = document.createElement("input");
  deletebtn.type = "button";
  deletebtn.value = "❌";
  newtodocontainer.appendChild(taskvalue);
  btndiv.appendChild(checkbox);
  btndiv.appendChild(deletebtn);
  btndiv.classList.add("btn-of-todo");
  newtodocontainer.appendChild(btndiv);
  newtodocontainer.classList.add("todo-element-display");
  displaytodo.appendChild(newtodocontainer);
  deletebtn.addEventListener("click", function () {
    deleteTodo(value, function (error) {
      if (error) {
        alert(error);
      } else {
        newtodocontainer.removeChild(btndiv);
        newtodocontainer.removeChild(taskvalue);
        displaytodo.removeChild(newtodocontainer);
      }
    });
  });
}

//delete a todo from the UI
function deleteTodo(value, callback) {
  fetch("/delete-todo", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: value, createdBy: user }),
  }).then(function (response) {
    if (response.status === 200) {
      callback();
    } else {
      callback("Error while deleting the todos!");
    }
  });
}

//get all todos
function getallTodos() {
  fetch("/get-all-todos?name=" + user)
    .then(function (response) {
      if (response.status !== 200) {
        console.log(response);
        throw new Error("Error while fetching the all todos!");
      }
      return response.json();
    })
    .then(function (todos) {
      console.log(todos);
      todos.forEach(function (todo) {
        addTodoDom(todo.text);
      });
    })
    .catch(function (error) {
      alert(error);
    });
}
