const fs = require("fs");

// db fuction 
function addTaskToDB(taskname) {
    if (taskname.trim() == "") return;
    let taskObj = {
        id : makeRandomID(),
        task : taskname,
        isComplete : false,
        time : getTaskTime()
    };
    fs.readFile("./db/db.json", "utf8", (err, data) => {
        if (err) {
            console.log(err);
        }
        else{
            const allTaskObj = JSON.parse(data);
            allTaskObj.push(taskObj);
            const jsonTaskObj = JSON.stringify(allTaskObj, null, 3);
            fs.writeFileSync("./db/db.json", jsonTaskObj);
            return allTaskObj;
        }
    })
}


function getAllTasks (){
    const allTasks = fs.readFileSync("./db/db.json");
    return JSON.parse(allTasks);
}

function getAllUsers (){
    const users = fs.readFileSync("./db/users.json");
    return JSON.parse(users);
}

function addNewUser(username, password){
    const users = getAllUsers();
    users.push({username, password});
    const updatedUserJson = JSON.stringify(users, null, 3);
    fs.writeFileSync("./db/users.json", updatedUserJson);
}

function deleteTask (id){
    try{
        const tasks = getAllTasks();
        const filteredTasks = tasks.filter(task => task.id !== id);
        fs.writeFileSync("./db/db.json", JSON.stringify(filteredTasks, null, 3));
        console.log("Task deleted from db");
        return filteredTasks;
    }
    catch (err) {
        console.log(err);
    }
}


function editTask (taskId, newText) {
    if (newText.trim() == "") throw new Error("Task text is empty");
    const allTasks = getAllTasks();
    const taskToBeEdited = allTasks.find(task => task.id == taskId);
    if (taskToBeEdited == undefined) throw new Error("Task to be edited not found");
    taskToBeEdited.task = newText;
    taskToBeEdited.time = new Date().toLocaleString();
    fs.writeFileSync("./db/db.json", JSON.stringify(allTasks, null, 3));
    return allTasks;
}


function markTaskCompleted(taskId){
    const allTasks = getAllTasks();
    const taskToBeMarked = allTasks.find(task => task.id == taskId);
    if (taskToBeMarked == undefined) throw new Error("Task to be edited not found");
    taskToBeMarked.isComplete = !taskToBeMarked.isComplete;
    fs.writeFileSync("./db/db.json", JSON.stringify(allTasks, null, 3));
    return allTasks;
}


module.exports = {
    addTaskToDB,
    getAllTasks,
    deleteTask,
    editTask,
    markTaskCompleted,
    getAllUsers,
    addNewUser
};




// util functions
function makeRandomID (){
    return Math.floor(Math.random()*1000000);
}

function getTaskTime(){
    const time = new Date();
    return time.toLocaleString();
}