const getProjects = async (projects) => {
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
        refreshProject(data,projects);
    }catch(e){
        refreshProject([],projects);
    }
} 

const renderProjects = (data) => {
    const aside = document.getElementById('menu-board');
    data.forEach(project => {
        const a = document.createElement('a');
        a.href = `/project/${project._id}`;
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

    aside.appendChild(img);
    aside.appendChild(p);
    aside.appendChild(button);

}

export{
    getProjects,
    renderProjects,
    refreshProject,
    noProject
}