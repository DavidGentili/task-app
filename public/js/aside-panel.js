import { generateModal, removeModal } from "./modal-window.js";
import { addProjectToProjectBoard } from "./projectBoard.js";
import { generateAButton } from './button.js';
import { getInstance } from './request.js';
import { unauthorizedUser } from './user.js';
import { addNewMessage } from "./messages.js";


const projectOfAside = (project) => {
    const a = document.createElement('a');
    a.href = `/project/${project.id}`;
    a.textContent = project.name;
    return a;
}

const cleanAsidePanel = () => {
    let elem = document.getElementById('aside-menu').nextSibling;
    while(elem){
        const aux = elem;
        elem = elem.nextSibling;
        aux.remove();
    }
}

const generateAPanelProject = (name) => {
    const container = document.createElement('div');
    const header = document.createElement('div');
    const panel = document.createElement('div');
    const button = document.createElement('button');
    const i = document.createElement('i');
    const h6 = document.createElement('h6');
    
    container.className = 'panel-project';
    header.className = 'menu-panel-project';
    panel.className = 'panelProject';
    i.className = 'fas fa-chevron-down';
    h6.textContent = name;
    
    container.appendChild(header);
    container.appendChild(panel);
    header.appendChild(button);
    button.appendChild(i);
    header.appendChild(h6);

    button.addEventListener('click',toggleProject(i,panel));

    return container;
}

const renderProjects = (projects) => {
    cleanAsidePanel();
    const menu = document.getElementById('aside-menu');
    const aside = document.getElementById('aside-panel');
    const active = generateAPanelProject('active');
    const archived = generateAPanelProject('archived');
    const activePanel = active.firstChild.nextSibling;
    const archivedPanel = archived.firstChild.nextSibling;

    if(!document.getElementById('buttonAddNewProject'))
        menu.insertBefore(generateAButton('+ add new project','buttonAddNewProject','',prepareEventInputNewProject(projects)),menu.firstChild);

    aside.appendChild(active);
    aside.appendChild(archived);
    

    projects.forEach(project => {
        if(project.state === 'active')
            activePanel.appendChild(projectOfAside(project));
        else
            archivedPanel.appendChild(projectOfAside(project));
    })
}

//Renderiza la visualizacion necesaria para cuando no se tiene proyectos
const noProject = (projects) => {
    const aside = document.getElementById('aside-panel');
    const img = document.createElement('img');
    const p = document.createElement('p');

    img.src = 'img/no-project.png';
    img.alt = 'no projects';
    p.textContent = 'you don´t have projects yet';

    aside.appendChild(img);
    aside.appendChild(p);
    aside.appendChild(generateAButton('Add one', 'buttonAddOneProject',undefined,prepareEventInputNewProject(projects)));

}

//evento que renderiza una ventana modal y se encarga de asignar los elementos del header
const prepareEventInputNewProject = (projects) => {
    return (e) => {  
        e.preventDefault();
        generateModal('Create a new project');
        const body = document.getElementById('bodyCard');        
        bodyNewProject(body, projects);
    }
}

//Renderiza los elementos de del cuerpo de la ventana modal
const bodyNewProject = (body, projects) => {
    const form = document.createElement('form');
    const input = document.createElement('input');
    const button = document.createElement('button');

    input.type = 'text';
    input.name = 'nameProject';
    input.placeholder = 'Project name';
    input.addEventListener('keydown', (e) => {
        if(e.key === 'Enter')
            prepareEventNewProject(projects);
    })
    button.textContent = 'Add project'
    button.addEventListener('click',prepareEventNewProject(projects));

    form.appendChild(input);
    form.appendChild(generateAButton('Add project',undefined,undefined,prepareEventNewProject(projects)));
    body.appendChild(form);

    input.focus();

}

//Se encarga de hacer un post del nuevo proyecto, se añade a projectBoard y se renderizan todos los proyectos 
const prepareEventNewProject = (projects) => {
    return (e) => {
        e.preventDefault();
        const inputName = document.getElementsByName('nameProject')[0];
        const name = inputName.value;
        if(name && name.length > 0){
            removeModal();
            getInstance().post('project', {
                name
            })
            .then((res) => {
                if(res.status === 201){
                    const data = res.data;
                    addProjectToProjectBoard(data,projects);
                    renderProjects(projects);
                }
            })
            .catch((e) => {
                const res = e.response;
                if(res.status === 403)
                    unauthorizedUser();
                else
                    addNewMessage('opps, we are having problems with the server try again later','error');
            })
        } else {
            inputName.placeholder = 'Please insert a name project';
            inputName.style.borderBottom = '2px solid #DC3545'
        }
    }
}

const openAsidePanel = (e) => {
    document.getElementById('aside-panel').style.transform = 'translateX(0)';
}

const closeAsidePanel = (e) => {
    document.getElementById('aside-panel').style.transform = '';
}

const toggleProject = (icon,panel) => {
    return (e) => {
        if(icon.classList.contains('fa-chevron-down')){
            icon.className = 'fas fa-chevron-right';
            panel.style.display = 'none';
        } else{
            icon.className = 'fas fa-chevron-down';
            panel.style.display = '';
        }
    }
}


export{
    renderProjects,
    noProject,
    openAsidePanel,
    closeAsidePanel,
}