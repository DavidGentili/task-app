const Task = require('../models/Task');
const Project = require('../models/Project');

class ProjectClass{
    constructor(id,name,state){
        this.id = id;
        this.name = name;
        this.state = state;
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

const getQueryTask = (req) => {
    const {user} = req;
    let queryTask = {user};
    const {query} = req;
    if(query.taskState)
        queryTask.state = query.taskState;
    return queryTask;
}

const getQueryProject = (req) => {
    const {user} = req;
    let queryProject = {user};
    const {query} = req;
    if(query.projectState)
        queryProject.state = query.projectState;
    return queryProject;
}


const orderProjects = (projects,tasks) => {
    const orderedProjects = projects.map(project => new ProjectClass(project._id.toString(),project.name,project.state));
    orderedProjects.sort((a,b) => (a.name.toLowerCase() < b.name.toLowerCase()) ? -1 : 1);
    tasks.forEach(task => {
        const {_id, title, description,lastChangeDate,state} = task;
        const date = new Date(lastChangeDate);
        const newTask = new TaskClass(_id.toString(),title,description,state,date);
        const i = orderedProjects.findIndex(project => project.id === task.project);
        orderedProjects[i].addTask(newTask);
    })
    return orderedProjects;
}


const board = {
    GET: async (req,res) => {
        const {user} = req;
        const queryTask = getQueryTask(req);
        const queryProject = getQueryProject(req);
        const task = await Task.find(queryTask);
        const project = await Project.find(queryProject);
        if(project && task){
            const orderedProjects = orderProjects(project,task);
            res.statusCode = 200;
            res.end(JSON.stringify(orderedProjects));
        } else
            throw {message: 'we have a problem with the board', status: 400};

    }
};

module.exports = board;

