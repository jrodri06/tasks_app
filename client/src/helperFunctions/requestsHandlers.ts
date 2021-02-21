import swal from 'sweetalert';

import { offlineService, allQueues } from './offlineHandlers';
import { localTasks } from './localStorageHandlers';

const localHost = process.env.NODE_ENV === 'development' ? 'http://localhost:4001' : '';

// Post Requests for create, update and delete
const handlePostWhenOffline = async (
    details: any, 
    url: string, 
    requestObj: Object
) => {

    if (!navigator.onLine) {
        const direction = url.split('/');

        if(direction.includes('new-todo')) {
            offlineService.updateQueue(allQueues.newTasksQueue, details);
            localTasks.createTaskToList(details);
            return details;
        } else if(direction.includes('erase-task')) {
            offlineService.updateQueue(allQueues.eraseTasksQueue, details);
            localTasks.removeTaskFromList(details);
        } else if(direction.includes('update-task')) {
            offlineService.updateQueue(allQueues.updateTasksQueue, details);
            localTasks.updateTaskFromList(details);
        } else if(direction.includes('new-subtask')) {
            offlineService.updateQueue(allQueues.newSubtasksQueue, details);
            localTasks.createSubtaskToList(details);
        } else if(direction.includes('update-subtask')) {
            offlineService.updateQueue(allQueues.updateSubtasksQueue, details);
            localTasks.updateSubtaskFromList(details);
        } else if(direction.includes('remove-subtask')) {
            offlineService.updateQueue(allQueues.eraseSubtasksQueue, details);
        } 

        return localTasks.getTasks();
    } 
    else {
        return await fetch(url, requestObj);
    }
}

export const submitCUDInfo = async (
    url: string, 
    data: object, 
    type: 'erasure' | 'createUpdate'
) => {

    let request: Object = {};

    if(type === 'createUpdate') {
        request = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
    } else if(type === 'erasure') {
        request = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-HTTP-Method-Override': 'DELETE'
            },
            body: JSON.stringify(data)
        };
    }

    const response = await handlePostWhenOffline(data, url, request);

    if(response?.status === 400 || response?.status === 404 || response?.status === 500) {
        const { message } = await response.json();

        throw Error(message);
    }

    return response;
};

export const formPath = (userData: object, cb: Function) => {
    submitCUDInfo(`${localHost}/task/new-todo`, userData, 'createUpdate')
        .then(data => {
            if(Object.keys(data).length > 0) {
                // Offline scenario
                return { message: `Your task "${data.name}" will be added to the database once you're back online` };
            } else {
                return data.json();
            }
        })
        .then(res => {
            if(res.message) {
                swal('Horray!', res.message, 'success');
            }

            cb();
        }) 
        .catch(err => swal('Could not submit!', `${err}`, 'error'));
};

// No CUD
export const collectToDos = async (cb: Function) => {
    if (!navigator.onLine) {
        cb(localTasks.getTasks());
    } else {
        try {
            const response = await fetch(`${localHost}/task/all-tasks`);
            const data = await response.json();
    
            if(response.status === 500 || response.status === 400 || response.status === 404){
                throw Error(data.message);
            } else {
                localTasks.makeFullList(data);        
                cb(localTasks.getTasks());
            }
        } catch(err){
            swal('Something went wrong', `${err.message}`, 'error');
        }
    }
};

export const eraseTask = async (id: string) => {
    try {
        const response = await submitCUDInfo(`${localHost}/task/erase-task`, { id }, 'erasure');
        return response;
    } catch(err) {
        throw Error('Failed to erase the task');
    }
};

export const updateDoneStatus = async (dataUpdated: { 
    id: string, 
    done: boolean
}) => {
    try {
        const response = await submitCUDInfo(`${localHost}/task/update-task`, dataUpdated, 'createUpdate');
        return response.status;
    } catch(err) {
        console.error(err);
    }
}

export const createSubTask = async (subtask: { 
    done: boolean
    name: String
    parentId: String
    price: String
}) => {
    try {
        await submitCUDInfo(`${localHost}/task/new-subtask`, subtask, 'createUpdate');

        swal('Added!', `The subtask "${subtask.name}" has been added`, 'success');    
    }  catch(err) {
        console.error(err);
    }
}

export const updateSubTaskDone = async (subtask: Object) => {
    try { 
        await submitCUDInfo(`${localHost}/task/update-subtask`, subtask, 'createUpdate');
    }  catch(err) {
        console.error(err);
    }
}

// Not handling localhost yet
export const getPricesTotal = (taskId: String) => {
    const currentTasks = localTasks.getTasks();

    const selectedTask = currentTasks.find((task: { _id: string }) => task._id === taskId);
    let totalPrice = 0;

    if(selectedTask === undefined) {
        return totalPrice;
    } else {
        selectedTask.subtask.forEach((subtask: { price: string }) => {
            if(subtask.price !== null) {
                totalPrice = totalPrice + +subtask.price;
            }
        })
    
        return totalPrice;
    }
}

export const getTask = async (taskId: String, userOrigin: String) => {
    try {
        const response = await fetch(`${localHost}/task/get-task/${taskId}/${userOrigin}`);
        const data = await response.json();

        if(response.status === 500 || response.status === 404 || response.status === 400) {
            throw Error(data);
        }

        return data;
    } catch(err) {
        console.error(err);
    }
}

export const editTask = async (task: Object,  cb: Function) => {
    try {
        const response = await fetch(`${localHost}/task/get-task/edit`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        });

        if(response.status === 500 || response.status === 404 || response.status === 400) {
            throw Error('Could not update');
        }
        swal('Updated!', 'The task has been updated', 'success');
    } catch(err) {
        console.error(err);
    }

    cb();
}

export const convertSubToMain = async (id: string) => {
    try {
        const erasureResponse = await submitCUDInfo(`${localHost}/task/remove-subtask`, { id }, 'erasure');
        const taskElements = await erasureResponse.json();
        const { price, name, done, userCookie, lastUpdatedBy } = taskElements;

        const converted = {
            userCookie, 
            lastUpdatedBy,
            name,
            description: '',
            type: 'Other',
            specialInput: {},
            price,
            done
        };

        return await submitCUDInfo(`${localHost}/task/new-todo`, converted, 'createUpdate');
    } catch(err) {
        console.error(err)
    }
};