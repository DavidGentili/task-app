const Task = require('../models/Task');
const Project = require('../models/Project');

class ProjectClass{
    constructor(id,name){
        this.id = id;
        this.name = name;
        this.tasks = [];
    };

    addTask(task){
        this.tasks.push(task);
    }
}

class TaskClass{
    constructor(id,title,description,state,date){
        this.id = id;
        this.title = title;
        this.description = description;
        this.state = state;
        this.date = date;
    }
}


const orderProjects = (projects,tasks) => {
    const ordererProjects = projects.map(project => new ProjectClass(project._id,project.name));
    ordererProjects.sort((a,b) => (a<b) ? -1 : 1);
    tasks.forEach(task => {
        const {_id, title, description,lastChangeDate,state} = task;
        const date = new Date(lastChangeDate);
        const newTask = new TaskClass(_id,title,description,state,date);
        const i = ordererProjects.findIndex(project => project.id === task.project);
        ordererProjects[i].addTask(newTask);
    })
}


const board = {
    GET: async (req,res) => {
        const task = await Task.find({user: user.id});
        const project = await Project.find({user: user.id});
        if(project && task){
            const ordererProjects = orderProjects(project,task);
            res.statusCode = 200;
            res.end(JSON.stringify(ordererProjects));
        } else
            throw {message: 'we have a problem with the board', status: 400};

    }
};

module.exports = board;

