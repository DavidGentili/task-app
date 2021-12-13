import { openAsidePanel, closeAsidePanel, renderProjects, noProject } from './aside-panel.js'
import { addNewMessage } from './messages.js';
import { getProject, prepareModalEditProject } from './project.js';
import { getTask ,createObjectTask } from './task.js';
import { getUser, renderUser } from './user.js'

const idProject = document.URL.split('/').pop();




const starWindow = async () => {
    const user = await getUser();
    if(user){
        renderUser(user);
        getProject(idProject)
            .then( (data) => renderSingleProject(data))
        getProject()
            .then(data => {
                if(data.length !== 0){
                    data.sort((a,b) => (a.name.toLowerCase() < b.name.toLowerCase()) ? -1 : 1);
                    renderProjects(data);    
                } else
                    noProject();
            })
        getTask(idProject)
            .then( data => {
                if(Array.isArray(data) && data.length > 0)
                    renderTaskOfTheProject(data);
                else{
                    if(data != {}){
                        renderTaskOfTheProject([data]);
                    } else
                        addNewMessage('we can´t get the tasks', 'error');
                }
            })
        .catch((e) => {
            console.error(e);
        })
    }
}

const renderSingleProject = (data) => {
    const date = new Date(data.lastChangeDate);
    document.getElementById('firstLetter').textContent = data.name[0].toUpperCase();
    document.getElementById('titleOfTheProject').textContent = data.name;
    document.getElementById('stateOfTheProject').textContent = data.state;
    document.getElementById('dateOfTheProject').textContent = `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;
    document.getElementById('buttonEditProject').addEventListener('click', prepareModalEditProject(data));
    
}

const renderTaskOfTheProject = (tasks) => {
    const panel = document.getElementById('panel.body');
    // tasks.forEach(task => {
    //     const objTask = createObjectTask({})
    // })
}


starWindow()
document.getElementById('buttonOpenAsidePanel').addEventListener('click', openAsidePanel);
document.getElementById('buttonCloseAsidePanel').addEventListener('click',closeAsidePanel);