const Task = require('../models/Task');
const Project = require('../models/Project');
const {formatResponse} = require('../formatResponse');


const getTaskByQuery = async (query,user,res) => {
    const acceptedArgument = ['_id','project','state']
    const keys = Object.keys(query);
    const searchArgument = {user};
    keys.forEach(elem => {
        if(acceptedArgument.includes(elem))
            searchArgument[elem] = query[elem];
    })
    if(Object.keys(searchArgument).length){
        const task = await Task.find(searchArgument).lean();
        res.statusCode = 200;
        formatResponse(task)
        res.end(JSON.stringify(task));
    } else 
        throw {message: 'Bad query arguments', status: 400};
    
}

const taskHandler = {
    GET: async (req,res) => {
        const {user,query} = req;
        if(Object.keys(query).length)
            await getTaskByQuery(query,user,res);
        else{
            const tasks = await Task.find({user});
            res.statusCode = 200;
            formatResponse(tasks);
            res.end(JSON.stringify(tasks));
        }
        
    },
    POST: async (req,res) => {
        const {title, description,project} = req.data;
        const {user} = req;
        const curretProject = await Project.findById(project);
        if(curretProject){
            const newTask = new Task({title,description,project,user});
            await newTask.save();
            req.data.id = newTask._id.toString()
            res.statusCode = 201;
            res.end(JSON.stringify(req.data));
        } else{
            throw {message: 'non-existent project', status: 403};
        }
    },
    PUT: async (req,res) => {
        const {id, title, description, project, state} = req.data;
        const {user} = req;
        const lastChangeDate = Date.now();
        if(project){
            const currentProject = await Project.findById(project);
            if(!currentProject)
                throw {message: 'the project don´t exist', status: 400}
            if(currentProject.user !== user)
                throw {message: 'Unauthorized User', status:403};
        }
        if(!id){
            throw {message: 'unspecified id', status: 400}
        }
        const currentTask = await Task.findById(id);
        if(!currentTask)
            throw {message: 'incorrect id', status: 400};
        if(currentTask.user !== user)
            throw {message: 'Unauthorized User', status:403};

        await Task.findByIdAndUpdate(id,{title,description,project,state,lastChangeDate});
        res.statusCode = 201;
        res.end(JSON.stringify(req.data));
    },
    DELETE: async (req,res) => {
        const {id} = req.data;
        const {user} = req;
        const currentTask = await Task.findById(id);
        if(currentTask && currentTask.user === user){
            await Task.findByIdAndDelete(id);
            res.statusCode = 200;
            res.end(JSON.stringify(req.data));
        } else
            throw (!currentTask) ? {message: 'error to delete the task', status: 400} : {message: 'Unauthorized User', status:403};
    }
}

module.exports = taskHandler