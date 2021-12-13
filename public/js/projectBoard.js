const removeTaskOfProjectBoard = (task,projectBoard) => {
    const i = projectBoard.findIndex(project => {
        const tasks = project.tasks;
        return tasks.some(current => current.id === task.id);
    })
    if(i !== -1){
        projectBoard[i].tasks = projectBoard[i].tasks.filter(current => current.id != task.id);
    }
}


const addTaskToProjectBoard = (task,projectBoard) => {
    const i = projectBoard.findIndex(project => project.id === task.project)
    const {id, title,description,state} = task;
    const date = (task.date) ? task.date : task.lastChangeDate
    const newTask = {id,title,description,state,date}
    if(i !== -1){
        projectBoard[i].tasks.push(newTask);
    }
    return newTask;
}

const addProjectToProjectBoard = (project, projectBoard) => {
    projectBoard.push({
        id: project.id,
        name: project.name,
        state: project.state,
        date: project.lastChangeDate,
        tasks: []
    });
    sortProjectBoardByName(projectBoard);
}

const sortProjectBoardByName = (projectBoard) => {
    projectBoard.sort((a,b) => (a.name.toLowerCase() < b.name.toLowerCase()) ? -1 : 1);
}

const generateProjectBoard = (projects,tasks) => {
    const projectBoard = [];
    projects.forEach(project => addProjectToProjectBoard(project,projectBoard));
    tasks.forEach(task => addTaskToProjectBoard(task,projectBoard));
    sortProjectBoardByName(projectBoard);
    return projectBoard;
}

export {
    removeTaskOfProjectBoard,
    addTaskToProjectBoard,
    addProjectToProjectBoard,
    sortProjectBoardByName,
    generateProjectBoard
}