const express = require("express");
const cors = require("cors");
const JWT = require("jsonwebtoken");
const {addTaskToDB, getAllTasks, deleteTask, editTask, markTaskCompleted, getAllUsers, addNewUser} = require("./db/index");
const { auth } = require("./middleware/auth");
const app = express();
const port = process.env.PORT || 3100;
app.use(express.json());
app.use(cors());

const JWT_SECRECT = "helloworld";

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/me", auth, (req, res) => {
    try{
        const username = req.username;
        const users = getAllUsers();
        const user = users.find(user => user.username == username);
        res.json(user);  
    }
    catch (err){
        res.status(404).json({msg : err});
    }
})

app.post("/signin", (req, res) => {
    try{
        const username = req.body.username;
        const password = req.body.password;
        const allUsers = getAllUsers();
        const findUser = allUsers.find(user => (user.username == username && user.password == password));
        if (findUser){
            const token = JWT.sign({
                username: username
            }, JWT_SECRECT);
            res.json({token});
        }
        else{
            res.status(404).json({msg : "User doesnt exits"});
        }

    }
    catch(err){
        res.json({msg : err})
    }
})

app.post("/signup", (req, res) => {
    try{
        const username = req.body.username;
        const password = req.body.password;
        const allUsers = getAllUsers();
        const foundUser = allUsers.findIndex(user => user.username == username);
        if (foundUser == -1){
            addNewUser(username, password);
            res.json({msg : "User added to database"});
        }
        else {
            res.status(404).json({msg : "User already exit"});
        }
    }
    catch(err){
        res.status(404).json(err)
    }
    
})

app.post("/add", auth, (req, res) => {
    const taskText = req.body.task;
    if (taskText == undefined) {
        res.status(404).json({
            "msg" : "task text not given"
        })
    }
    const updatedTasks = addTaskToDB(taskText);
    res.json(updatedTasks);
});

app.get("/allTasks", auth, (req, res) => {
    try{
        const tasks = getAllTasks();
        res.json(tasks);
    }
    catch(err){
        res.status(404).json({
            "msg" : err
        })
    }
})

app.put("/edit", auth, (req, res) => {
    try{
        const taskId = req.body.id;
        const text = req.body.text;
        const a = editTask(Number(taskId), text);
        res.json(a);
    }
    catch(err) {
        res.status(404).json({
            "msg" : err.message
        })
    }
    
})

app.put("/mark/:id", auth, (req, res) => {
    try{
        const taskId = req.params.id;
        const updatedTasks = markTaskCompleted(taskId);
        res.json(updatedTasks);
    }
    catch(err) {
        res.status(404).json({
            "msg" : err.message
        })
    }
})

app.delete("/delete/:id", auth, (req, res) => {
    const taskId = req.params.id;
    if (!Number(taskId)) res.status(404).json({"msg" : "Not a valid task id"});
    const filteredTask = deleteTask(Number(taskId));
    res.json(filteredTask);
    
})

app.listen(port);