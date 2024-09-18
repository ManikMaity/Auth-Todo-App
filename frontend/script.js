const taskContainerEle = document.querySelector(".tasks-container");
const spinnerEle = document.querySelector(".spinner-ele");
const taskInputEle = document.getElementById("taskInput");
const taskInputBtn = document.getElementById("taskInputBtn");
const signupContainerEle = document.querySelector(".signup-container");
const todoMainContianerEle = document.querySelector(".todo-main-container");
const signinBtnEle = document.querySelector(".signin-btn");
const signupBtnEle = document.querySelector(".signup-btn");
const logoutBtnEle = document.getElementById("logout-btn");
const logedUsernameEle = document.getElementById("loged-username");
let isSignedIn = false;

async function getUserData() {
  const token = localStorage.getItem("token");
  const userData = await axios.get("http://localhost:3100/me", {
    headers: {
      token,
    },
  });
  if (userData.status == 200) {
    isSignedIn = true;
    showScreen();
    logedUsernameEle.textContent = userData.data.username || "Unknown";
  } else {
    isSignedIn = false;
  }
}

getUserData();
showScreen();

function showScreen() {
  if (isSignedIn) {
    signupContainerEle.style.display = "none";
    todoMainContianerEle.style.display = "block";
  } else {
    signupContainerEle.style.display = "flex";
    todoMainContianerEle.style.display = "none";
  }
}

async function signup(e) {
  const usernameEle = document.getElementById("signup-username-form");
  const passwordEle = document.getElementById("signup-password");
  const username = usernameEle.value;
  const password = passwordEle.value;
  if (username.trim() == "" || password.trim() == "") {
    alert("Please enter proper value");
    return;
  } else {
    try {
      e.target.textContent = "Loading..";
      const addUser = await axios.post("http://localhost:3100/signup", {
        username,
        password,
      });
      alert(addUser.data.msg);
    } catch (err) {
      alert(err.response.data.msg);
    } finally {
      e.target.textContent = "Signup";
      usernameEle.value = "";
      passwordEle.value = "";
    }
  }
}

async function signin(e) {
  const usernameEle = document.getElementById("signin-username-form");
  const passwordEle = document.getElementById("signin-password");
  const username = usernameEle.value;
  const password = passwordEle.value;
  if (username.trim() == "" || password.trim() == "") {
    alert("Please enter proper value");
    return;
  } else {
    try {
      e.target.textContent = "Loading..";
      const signinMessage = await axios.post("http://localhost:3100/signin", {
        username,
        password,
      });
      alert("You are signed in");
      localStorage.setItem("token", signinMessage.data.token);
      window.location.reload();
    } catch (err) {
      alert(err.response.data.msg);
    } finally {
      e.target.textContent = "Signin";
      usernameEle.value = "";
      passwordEle.value = "";
    }
  }
}

async function getAllTasks() {
  const tasks = await axios.get("http://localhost:3100/allTasks", {
    headers: {
      token: localStorage.getItem("token"),
    },
  });
  return tasks.data;
}

async function renderAllTasks() {
  const allTasks = await getAllTasks();
  renderTask(allTasks);
}

function renderTask(allTasks) {
  spinnerEle.classList.remove("d-none");
  spinnerEle.classList.add("d-none");
  taskContainerEle.innerHTML = "";
  allTasks.forEach((task) => {
    let taskEle = document.createElement("tr");
    taskEle.id = task.id;
    taskEle.innerHTML = `<th scope="row">
                      </th>
                      <td>
                      <p id="text-${task.id}">${task?.task}</p>
                      <input type="text" name="" id="edit-${task.id}" class="form-control d-none" value="${task?.task}"/>
                      </td>
                      <td>${task?.time}</td>`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.isComplete;
    checkbox.addEventListener("change", (e) => {
      handleMarkChange(task.id, e);
    });
    taskEle.insertAdjacentElement("afterbegin", checkbox);

    const controlsTd = document.createElement("td");
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("btn", "btn-danger");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      handleDelete(task.id);
    });

    const editBtn = document.createElement("button");
    editBtn.classList.add("btn", "btn-success", "ms-1");
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", function editTask(e) {
      handleEdit(task.id, e);
    });

    controlsTd.insertAdjacentElement("beforeend", deleteBtn);
    controlsTd.insertAdjacentElement("beforeend", editBtn);
    taskEle.insertAdjacentElement("beforeend", controlsTd);
    taskContainerEle.insertAdjacentElement("beforeend", taskEle);
  });
}

async function handleMarkChange(id, e) {
  const updatedTasks = await await axios.put(
    `http://localhost:3100/mark/${id}`,
    {
      headers: {
        token: localStorage.getItem("token"),
      },
    }
  );
  renderTask(updatedTasks.data);
}

async function handleDelete(id) {
  const updatedTasks = await axios.delete(
    `http://localhost:3100/delete/${id}`,
    {
      headers: {
        token: localStorage.getItem("token"),
      },
    }
  );
  renderTask(updatedTasks.data);
}

function handleEdit(id, e) {
  const editBoxEle = document.getElementById(`edit-${id}`);
  const textEle = document.getElementById(`text-${id}`);
  editBoxEle.classList.toggle("d-none");
  textEle.classList.toggle("d-none");

  editBoxEle.addEventListener("keyup", async (e) => {
    if (e.key == "Enter") {
      const updatedTasks = await axios.put(`http://localhost:3100/edit`, {
        text: editBoxEle.value,
        id: id,
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      renderTask(updatedTasks.data);
      editBoxEle.classList.toggle("d-none");
      textEle.classList.toggle("d-none");
    }
  });
}

taskInputBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  if (taskInputEle.value.trim() == "") return;
  const updatedTasks = await axios.post("http://localhost:3100/add", {
    task: taskInputEle.value,

    headers: {
      token: localStorage.getItem("token"),
    },
  });
  renderAllTasks();
  taskInputEle.value = "";
});

signupBtnEle.addEventListener("click", (e) => {
  e.preventDefault();
  signup(e);
});

signinBtnEle.addEventListener("click", (e) => {
  e.preventDefault();
  signin(e);
});

logoutBtnEle.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("token");
  location.reload();
});

renderAllTasks();
