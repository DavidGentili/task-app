import { generateModal, removeModal } from "./modal-window.js";

const getProjects = async () => {
    const url = 'http://localhost:8080/api/project?state=active';
    const authentication = localStorage.getItem('userToken');
    const aside = document.getElementById('menu-board');
    try{
        const res = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers: {
                "authentication" : authentication,
                "Content-Type" : "application/json"  
            }
        })
        const data = await res.json();
        return data;
    }catch(e){
        return [];
    }
} 

const renderProjects = (data) => {
    const aside = document.getElementById('menu-board');
    const menu = document.getElementById('aside-menu');

    const button = document.createElement('button');
    button.textContent = '+ add new project';
    button.id = 'buttonAddNewProject';
    button.addEventListener('click',eventNewProject);

    menu.insertBefore(button,menu.firstChild);

    data.forEach(project => {
        const a = document.createElement('a');
        a.href = `/project/${project.id}`;
        a.textContent = project.name;
        aside.appendChild(a);
    })
}

const refreshProject = (data,projects) => {
    while(projects.length)
        projects.pop();
    data.forEach(elem => projects.push(elem));
}

const noProject = () => {
    const aside = document.getElementById('menu-board');
    const img = document.createElement('img');
    const p = document.createElement('p');
    const button = document.createElement('button');

    img.src = 'img/no-project.png';
    img.alt = 'no projects';
    p.textContent = 'you don´t have projects yet';
    button.textContent = 'Add one';
    button.id = 'buttonAddOneProject';
    button.addEventListener('click',eventNewProject);

    aside.appendChild(img);
    aside.appendChild(p);
    aside.appendChild(button);

}

const postNewProject = (e) => {
    e.preventDefault();
    const url = 'http://localhost:8080/api/project'
    const name = document.getElementsByName('nameProject')[0];
    const value = name.value;
    const data = {name:name.value};
    if(value && value.length > 0){
        fetch(url, {
            method: 'POST',
            mode: 'cors',
            headers:{
                "authentication" : localStorage.getItem('userToken'),
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(async (res) => {
            if(res.status === 201){
                removeModal();
                const projects = await getProjects();
                renderProjects(projects);
            }
        })
    } else {
        name.placeholder = 'Please insert a name project';
        name.style.borderBottom = '2px solid #DC3545'
    }
}

const bodyNewProject = (body) => {
    const form = document.createElement('form');
    const input = document.createElement('input');
    const button = document.createElement('button');

    input.type = 'text';
    input.name = 'nameProject';
    input.placeholder = 'Project name';
    button.textContent = 'Add project'
    button.addEventListener('click',postNewProject);

    form.appendChild(input);
    form.appendChild(button);
    body.appendChild(form);

}

const eventNewProject = (e) => {
    generateModal();
    const header = document.getElementById('headerCard');
    const body = document.getElementById('bodyCard');

    const h4 = document.createElement('h4');
    h4.textContent = 'Create a new project';
    header.insertBefore(h4,header.firstChild);
    
    bodyNewProject(body);
}

export{
    getProjects,
    renderProjects,
    refreshProject,
    noProject
}