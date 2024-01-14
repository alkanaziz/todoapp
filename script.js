"use strict";

let btnAddNewTaskElem = document.querySelector("#btnAddNewTask")
let inputTaskElem = document.querySelector("#inputTask");
let btnClearElem = document.querySelector("#btnClear");
const filtersElem = document.querySelectorAll(".filters span");
let editId;
let newId;
let isEditTask = false;
let taskList = [];


if (localStorage.getItem("taskList") !== null) {
  taskList = JSON.parse(localStorage.getItem("taskList"));
}


displayTasks("all");

// Display Tasks from taskList Array Function
function displayTasks(filter) {
  let ulElem = document.getElementById("task-list");
  // console.log(ulElem); 

  ulElem.innerHTML = "";

  if (taskList.length == 0) {

    ulElem.innerHTML = "<p class='p-3 m-0'>Alle tasks sind erledigt und gelöscht...</p>"

  } else {

    for (let task of taskList) {

      let completed = task.status == "completed" ? "checked" : "";

      if (filter == task.status || filter == "all") {

        let li = /*html*/ `
                  <li class="task list-group-item">
                    <div class="form-check">
                      <input
                      type="checkbox"
                      name=""
                      onclick="updateStatus(this)"
                      id="${task.id}"
                      class="form-check-input" ${completed}
                      />
                      <label for="${task.id}" class="form-check-label ${completed}">${task.taskName}</label>
                    </div>
                    <div class="dropdown">
                      <button class="btn btn-link dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fa-solid fa-ellipsis"></i>
                      </button>
                      <ul class="dropdown-menu">
                        <li><a onclick="deleteTask(${task.id})" class="dropdown-item" href="#"><i class="fa-solid fa-trash"></i> Löschen</a></li>
                        <li><a onclick='editTask(${task.id}, "${task.taskName}")' class="dropdown-item" href="#"><i class="fa-solid fa-pen"></i> Bearbeiten</a></li>
                      </ul>
                    </div>
                  </li>
                  `;

        ulElem.insertAdjacentHTML("afterbegin", li);
      };

    };

  }

};

btnAddNewTaskElem.addEventListener("click", newTaskAdd);

// The KeyboardEvent Object
// btnAddNewTaskElem.addEventListener("keypress", function (event) {

//   if (event == "Enter") {
//     btnAddNewTaskElem.click;
//   }

// });

// Active Span Classlist Add or Remove "active"
for (let span of filtersElem) {
  span.addEventListener("click", function () {
    document.querySelector("span.active").classList.remove("active")
    span.classList.add("active");
    displayTasks(span.id);
  });
};


// // New Id Nummer Erzeugen
// let newId;
// function newIdNum() {
//   const id = taskList.map(i => i.id);
//   newId = Math.floor(Math.random() * 1000 + 1);
//   while (id.includes(newId)) {
//     newId = Math.floor(Math.random() * 1000 + 1);
//   };
//   return newId;
// };


// New Task Add Function
function newTaskAdd(event) {

  if (inputTaskElem.value == "") {

    alert("Fügen Sie bitte einen Taskname...")

  } else {

    if (!isEditTask) {
      newId = taskList.length > 0 ? taskList[taskList.length-1].id+1 : 1;
      // Einfügen: isEditTask is false as default. !isEditTask is true.
      taskList.push({ "id": newId, "taskName": inputTaskElem.value, "status": "pending" });
      // console.log(idList)

    } else {

      // Bearbeiten - Aktualisierung Task: if isEditTask is true, we can update the task.
      for (let task of taskList) {
        if (task.id == editId) {
          task.taskName = inputTaskElem.value;
        }
        isEditTask = false;
      }

    }

    inputTaskElem.value = "";
    displayTasks(document.querySelector("span.active").id);
    localStorage.setItem("taskList", JSON.stringify(taskList));
  }


  // console.log(taskList);

  event.preventDefault();
}


// Delete Task Function
function deleteTask(id) {
  console.log(id);

  let deletedId;
  for (let index in taskList) {
    if (taskList[index].id == id) {
      deletedId = index;
    }
  }

  // deletedId = taskList.findIndex(function(task) {
  //   console.log(task.id == id)
  //   return task.id == id;
  // });

  // Arrow Function
  // deletedId = taskList.findIndex(task => task.id == id);

  taskList.splice(deletedId, 1);
  displayTasks(document.querySelector("span.active").id);
  localStorage.setItem("taskList", JSON.stringify(taskList));
}


// Edit Tasks Function
function editTask(taskId, taskName) {
  isEditTask = true;

  editId = taskId;
  inputTaskElem.value = taskName;
  inputTaskElem.focus();
  inputTaskElem.classList.add("active");

  console.log("edit id", editId);
  console.log("edit mode", isEditTask);
}


// Delete all tasks function
btnClearElem.addEventListener("click", function () {
  // console.log("click event: task clear");
  taskList.splice(0, taskList.length);
  localStorage.setItem("taskList", JSON.stringify(taskList));
  displayTasks();
});

// Update Status Checkbox
function updateStatus(selectedTask) {
  // console.log(selectedTask.parentElement.lastElementChild);
  console.log(selectedTask.nextElementSibling);

  let labelElem = selectedTask.nextElementSibling;
  let status;

  if (selectedTask.checked) {
    labelElem.classList.add("checked")
    status = "completed";
  } else {
    labelElem.classList.remove("checked")
    status = "pending";
  }

  for (let task of taskList) {
    if (task.id == selectedTask.id) {
      task.status = status;
    };
  };
  displayTasks(document.querySelector("span.active").id);
  localStorage.setItem("taskList", JSON.stringify(taskList));
  // console.log(taskList)
}