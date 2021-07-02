let initialMenuId;
let presentTask;
let currentCategoryId;
let navMenuList;

function initialize() {
  let myDay = { menuName: "My Day", id: "menu-MyDay", icon: "fas fa-sun", task: new Array() };
  let important = { menuName: "Important", id: "menu-Important", icon: "fas fa-star", task: new Array() };
  let planned = { menuName: "Planned", id: "menu-Planned", icon: "fas fa-calendar", task: new Array() };
  let assignedToYou = { menuName: "Assigned to you", id: "menu-AssignedToYou", icon: "fas fa-user", task: new Array() };
  let allTasks = { menuName: "Tasks", id: "menu-Tasks", icon: "fas fa-home", task: new Array() };
  navMenuList = [myDay, important, planned, assignedToYou, allTasks];
  navMenuList.forEach((menuItem) => {
    addNavigationMenu(menuItem);
  });
  initialMenuId = navMenuList[4].id;
  displayNewMenuList(navMenuList[4]);
  highLightNavMenu(initialMenuId, initialMenuId);
}

function displayNewMenuList(navMenu) {
  document.getElementById("menu-head").innerHTML = navMenu.menuName;
  displayEventTasks(navMenu.task);
  displayNoOfRows(navMenu.task.length);
}

function displayEventTasks(tasks) {
  console.log(tasks);
  let roundIcon;
  let starIcon;
  let newTaskList = document.getElementById("new-task-list");
  newTaskList.innerHTML = "";
  tasks.forEach(function (currentTask) {
    let taskElement = addElements(currentTask.id, "li", "new-task-element");
    let taskContent = addElements(currentTask.id, "div", "task-content");

    if (currentTask.completed) {
      roundIcon = addElements(currentTask.taskIconId, "i", "fas fa-check-circle");
      taskContent.innerHTML = currentTask.taskName.strike();
    } else {
      roundIcon = addElements(currentTask.taskIconId, "i", "far fa-circle");
      taskContent.innerHTML = currentTask.taskName;
    }

    if (currentTask.important) {
      starIcon = addElements(currentTask.importantIconId, "i", "fas fa-star");
    } else {
      starIcon = addElements(currentTask.importantIconId, "i", "far fa-star");
    }
    newTaskList.appendChild(taskElement).append(roundIcon, taskContent, starIcon);
  });
}

function addNavigationMenu(navMenu) {
  let menuList = document.getElementById("navigation-menu-list");
  let element = addElements(navMenu.id, "li", "list-element");
  let icon = addElements("", "i", navMenu.icon);
  let content = addElements("", "div", "nav-menu-name");
  let count = addElements(navMenu.id + "-taskcount", "span", "task-count");
  content.innerHTML = navMenu.menuName;
  menuList.appendChild(element).append(icon, content, count);
}

function addElements(taskId, element, className) {
  let htmlElement = document.createElement(element);
  htmlElement.setAttribute("class", className);

  if ("" != taskId) {
    htmlElement.setAttribute("id", taskId);
  }
  return htmlElement;
}

function displayTasks(event) {
  let elementId = event.target.id;
  //console.log(event.target.id);
  navMenuList.forEach(function (task) {

    if (elementId == task.id) {
      let oldMenuId = initialMenuId;
      initialMenuId = elementId;
      currentCategoryId = task.id;
      //alert(currentCategoryId);
      document.getElementById("task-container").setAttribute("class", "task-container");
      document.getElementById("subtask-container").style.display = "none";
      highLightNavMenu(initialMenuId, oldMenuId);
      displayNewMenuList(task);
    }
  });
}

function highLightNavMenu(newMenuId, oldMenuId) {
  document.getElementById(oldMenuId).setAttribute("class", "list-element");
  document.getElementById(newMenuId).setAttribute("class", "list-element current-menu");
}

function displayNoOfRows(countValue) {
  let taskList = document.getElementById("new-task-list");

  if (countValue < 8) {
    let lines = 8 - countValue;

    for (let i = 0; i < lines; i++) {
      let task = addElements("", "li", "null-task");
      taskList.appendChild(task);
    }
  }
}

let untitledListCount = 0;

function addNewMenu() {
  let inputValue = document.getElementById("new-nav-menu-input").value;

  if ("" == inputValue) {
    inputValue = (0 == untitledListCount) ? "Untitled list" : "Untitled list (" + untitledListCount + ")";
  }
  untitledListCount++;
  let newValue = document.createTextNode(inputValue);
  newValue = { menuName: inputValue, id: inputValue, icon: "fas fa-list", task: new Array() };
  navMenuList.push(newValue);
  addNavigationMenu(newValue);
  let oldMenuId = initialMenuId;
  highLightNavMenu(initialMenuId, oldMenuId);
  displayNewMenuList(newValue);
  document.getElementById("new-nav-menu-input").value = "";
}

function addNewTask() {
  document.getElementById("add-button").setAttribute("class", "hide-add-button");
  document.getElementById("plus-icon").setAttribute("class", "fas fa-plus");
  let inputValue = document.getElementById("task-input").value;

  if ("" != inputValue) {
    let newTask = createTaskObject(inputValue);
    let currentTask = getTask(initialMenuId);
    currentTask.task.unshift(newTask);
    if (initialMenuId != "menu-Tasks") {
      navMenuList[4].task.unshift(newTask);
      let tempVar = document.getElementById("menu-Tasks-taskcount");
      tempVar.setAttribute("class", "task-countvalue");
      tempVar.innerHTML = incompleteTaskCount(navMenuList[4].task);
    }
    displayNewMenuList(currentTask);
    let tempVariable = document.getElementById(currentTask.id + "-taskcount");
    tempVariable.setAttribute("class", "task-countvalue");
    tempVariable.innerHTML = incompleteTaskCount(currentTask.task);
  }
  document.getElementById("task-input").value = "";
}

let taskIdCount = 1;
function createTaskObject(inputValue) {
  let isImportant = ("important" == initialMenuId) ? true : false;
  newTaskObject = {
    taskName: inputValue, id: "task-" + taskIdCount, completed: false, important: isImportant,
    taskIconId: "task-icon-" + taskIdCount, importantIconId: "important-icon-" + taskIdCount,
    subtaskIconId: "subtask-icon-" + taskIdCount, subtaskImportantIconId: "subimportant-icon-" + taskIdCount,
    steps: new Array()
  };
  taskIdCount++;
  return newTaskObject;
}

function taskClick(event) {
  //console.log(event.target.id);
  let currentTask = getTask(initialMenuId);
  let eventTargetId = event.target.id;
  for (let index = 0; index < currentTask.task.length; index++) {
    presentTask = currentTask.task[index];
    if (eventTargetId == presentTask.taskIconId || eventTargetId == presentTask.subtaskIconId) {
      displaySubContainer(presentTask);
      if (true == presentTask.completed) {
        markTaskComplete(presentTask.id);
      } else {
        markTaskComplete(presentTask.id);
      }
    } else if (eventTargetId == presentTask.importantIconId || eventTargetId == presentTask.subtaskImportantIconId) {
      displaySubContainer(presentTask);
      if (true == presentTask.important) {
        for (let index1 = 0; index1 < navMenuList[1].task.length; index1++) {
          if ((eventTargetId == navMenuList[1].task[index1].importantIconId) ||
            eventTargetId == navMenuList[1].task[index1].subtaskImportantIconId) {
              navMenuList[1].task.splice(index1, 1);
          }
        }
        displayNewMenuList(getTask(initialMenuId));
        markTaskImportant(presentTask.id);
      } else {
        navMenuList[1].task.push(presentTask);
        markTaskImportant(presentTask.id);
      }
    } else if (eventTargetId == presentTask.id) {
      document.getElementById("task-container").setAttribute("class", "task-container reduce-width");
      document.getElementById("subtask-container").style.display = "inline-block";
      displaySubContainer(presentTask);
    }
  }
}

function markTaskComplete(taskId) {
  let sample = new Array();
  navMenuList.forEach((category) => {
    if (category.id === currentCategoryId) {
      category.task.forEach((task) => {
        if (task.id === taskId) {
          task.completed = !task.completed;
          displaySubContainer(task);
        }
      });
    } 
    displayEventTasks(category.task);
  });
}

function markTaskImportant(taskId) {
  let sample = new Array();
  navMenuList.forEach((category) => {
    console.log(category);
    if (category.id === currentCategoryId) {
      category.task.forEach((task) => {
        if (task.id === taskId) {
          task.important = !task.important;
          displaySubContainer(task);
        }
      });
    } 
    displayEventTasks(category.task);
  });
  /*task.important = important;
  document.getElementById("important-taskcount").innerHTML = taskCount;
  document.getElementById(task.importantIconIdId).setAttribute("class", className);
  document.getElementById(task.subtaskImportantIconIdId).setAttribute("class", className);*/
}

function displaySubContainer(task) {
  let starIcon;
  let headerIcon;
  let headElement = document.getElementById("subtask-header");
  headElement.innerHTML = "";
  let taskHeader = addElements(task.id, "h4", "task-heading");
  if (task.completed) {
    headerIcon = addElements(task.taskIconId, "i", "fas fa-check-circle");
    taskHeader.innerHTML = task.taskName.strike();
  } else {
    headerIcon = addElements(task.subtaskIconId, "i", "far fa-circle");
    taskHeader.innerHTML = task.taskName;
  }

  if (task.important) {
    starIcon = addElements(task.subtaskImportantIconId, "i", "fas fa-star");
  } else {
    starIcon = addElements(task.subtaskImportantIconId, "i", "far fa-star");
  }
  headerIcon.setAttribute("onclick", "taskClick(event)");
  starIcon.setAttribute("onclick", "taskClick(event)");
  headElement.append(headerIcon, taskHeader, starIcon);
  displaySubTasks(task.steps);
}

function displaySubTasks(subTask) {
  let subTaskList = document.getElementById("subtask-list");
  subTaskList.innerHTML = "";
  subTask.forEach(function (step) {
    let subElement = addElements("", "li", "subtask-element");
    let subIcon = addElements("", "i", "far fa-circle");
    let subContent = addElements("", "div", "subtask-content");
    let crossIcon = addElements("", "i", "fas fa-times")
    subContent.innerHTML = step;
    subTaskList.appendChild(subElement).append(subIcon, subContent, crossIcon);
  });
}

function addSubTask(event) {
  document.getElementById("add-step-button").setAttribute("class", "hide-add-button");
  document.getElementById("subtask-plus-icon").setAttribute("class", "fas fa-plus");
  let newSubTask = document.getElementById("subtask-input").value;

  if ("" != newSubTask) {
    presentTask.steps.push(newSubTask);
    displaySubTasks(presentTask.steps);
  }
  document.getElementById("subtask-input").value = "";
}

function getTask(menuId) {
  for (let i = 0; i < navMenuList.length; i++) {
    if (menuId === navMenuList[i].id) {
      return navMenuList[i];
    }
  }
}

function incompleteTaskCount(task) {
  let incompleteCount = 0;
  task.forEach(function (tasks) {
    if (tasks.completed == false) {
      incompleteCount++;
    }
  });
  return incompleteCount;
}

function enterKeyEvent(event) {

  if (13 == event.keyCode) {
    switch (event.target.id) {
      case "new-nav-menu-input":
        addNewMenu();
        break;
      case "task-input":
        addNewTask();
        break;
      case "subtask-input":
        addSubTask(event);
        break;
    }
  }
}

function clickEvent(event, checkValue) {
  switch (checkValue) {
    case "navBarMenu":
      displayTasks(event);
      break;
    case "addTask":
      addNewTask();
      break;
    case "tasks":
      taskClick(event);
      break;
  }
}

initialize();