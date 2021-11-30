const Project = require('../../models/Project');
const Task = require('../../models/Task');

const getProjectByQuery = async (query,user,res) => {
    const acceptedArgument = ['_id','state']
    const keys = Object.keys(query);
    const searchArgument = {user};
    keys.forEach(elem => {
        if(acceptedArgument.includes(elem))
            searchArgument[elem] = query[elem];
    })
    if(Object.keys(searchArgument).length){
        const project = await Project.find(searchArgument);
        res.statusCode = 200;
        res.end(JSON.stringify(project));
    } else 
        throw {message: 'Bad query arguments', status: 400};
}

const removeTaskOfTheProject = async (id) => {
    try{
        const tasks = await Task.find({project: id});
        tasks.forEach( async (task) => {
            await task.delete();
        })
    } catch(e){
        console.error(e);
    }
}

const projectsHandler = {
    GET: async (req,res) => {
        const {user,query} = req;
        if(Object.keys(query).length){
           getProjectByQuery(query,user,res);       
        } else{
            const projects = await Project.find({user});
            res.statusCode = 200;
            res.end(JSON.stringify(projects))
        }
    },
    POST: async (req,res) => {
        const {name} = req.data;
        const {user} = req;
        const newProject = new Project({name,user})
        await newProject.save();
        res.statusCode = 201; 
        res.end(JSON.stringify(req.data));
    },
    PUT: async (req,res) => {
        const {id,name,state} = req.data;
        const {user} = req;
        const lastChangeDate = Date.now();
        const project = await Project.findById(id);
        if(project && project.user === user){
            await Project.findByIdAndUpdate(id,{name,state,lastChangeDate});
            res.statusCode = 201;
            res.end(JSON.stringify(req.data));
        } else
            throw (!project) ? {message: 'error to modify the project', status: 400} : {message: 'Unauthorized User', status:403};
    },
    DELETE: async (req,res) => {
        const {id} = req.data;
        const {user} = req;
        const project = await Project.findById(id);
        if(project && project.user === user){
            await project.delete();
            removeTaskOfTheProject(id);
            res.statusCode = 200;
            res.end(JSON.stringify(req.data));
        } else 
            throw (!project) ? {message: 'error to delete the project', status: 400} : {message: 'Unauthorized User', status:403};
        
    }
}

module.exports = projectsHandler