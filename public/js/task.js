const getTasks = async (tasks) => {
    try{
        const url = 'http://localhost:8080/api/task?state=pending';
        const authentication = localStorage.getItem('userToken');
        const res = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers: {
                "authentication" : authentication,
                "Content-Type" : "application/json"
            }
        });
        const data = await res.json();
        refreshTasks(data,tasks);
    }catch(e){
        refreshTasks([],tasks);
    }
}

const refreshTasks = (data,tasks) => {
    while(tasks.length)
    tasks.pop();
    data.forEach(elem => tasks.push(elem));
}

const noTasks = () => {

}



export {
    getTasks,
    refreshTasks,
    noTasks
}
