import { getUser } from "./user.js";

const authentication = localStorage.getItem('userToken');

const auth = async () => {
    if(authentication){
        const user = await getUser()
        if(user != {})
            location.href = '/my-board';
    }
}

auth();

