import swal from 'sweetalert';

import { offlineService, allQueues } from './offlineHandlers';
import { localTasks } from './localStorageHandlers';

// Post Requests for create, update and delete
const handlePostWhenOffline = async (
    details: any, 
    url: string, 
    requestObj: Object
) => {

    if (!navigator.onLine) {
        const direction = url.split('/');

        switch(direction[direction.length - 1]) {
            case 'new-todo':
                offlineService.updateQueue(allQueues.newTasksQueue, details);
                return details;
            case 'remove-subtask':
                offlineService.updateQueue(allQueues.eraseSubtasksQueue, details);
                break;
            case 'erase-task':
                offlineService.updateQueue(allQueues.eraseTasksQueue, details);
                break;
            case 'update-task':
                offlineService.updateQueue(allQueues.updateTasksQueue, details);
                break;
            case 'new-subtask':
                offlineService.updateQueue(allQueues.newSubtasksQueue, details);
                break;
            case 'update-subtask':
                offlineService.updateQueue(allQueues.updateSubtasksQueue, details);
                break;
            default:
                return;
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
    submitCUDInfo(`/task/new-todo`, userData, 'createUpdate')
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
    cb(localTasks.getTasks());

    try {
        const response = await fetch('/task/all-tasks');
        const data = await response.json();

        if(response.status === 500 || response.status === 400 || response.status === 404){
            throw Error(data.message);
        } else {
            localTasks.makeFullList(data);        
            cb(localTasks.getTasks());
        }
    } catch(err){
        console.log(err);
        swal('Something went wrong', `${err.message}`, 'error');
    }
    
};

// To double check
export const convertSubToMain = async (id: string) => {
    try {
        const converted: any = submitCUDInfo('/task/remove-subtask', { id }, 'erasure')
            .then(res => res.json())
            .then(data => {
                const { price, name, done } = data;
                return {
                    name,
                    description: '',
                    type: 'Other',
                    specialInput: {},
                    price,
                    done
                }
            })
            .catch(err => console.error(err))
    
        return await submitCUDInfo(`/task/new-todo`, converted, 'createUpdate');

    } catch(err) {
        console.error(err);
    }
};


export const eraseTask = async (id: string) => {
    localTasks.removeTaskFromList({ id });

    try {
        const response = await submitCUDInfo('/task/erase-task', { id }, 'erasure');
        return response;
    } catch(err) {
        console.error(err);
    }
};

export const updateDoneStatus = async (dataUpdated: { 
    id: string, 
    done: boolean 
}) => {
    localTasks.updateTaskFromList(dataUpdated);

    try {
        const response = await submitCUDInfo('/task/update-task', dataUpdated, 'createUpdate');
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

    localTasks.createSubtaskToList(subtask);

    try {
        await submitCUDInfo('/task/new-subtask', subtask, 'createUpdate');

        swal('Added!', `The subtask "${subtask.name}" has been added`, 'success');    
    }  catch(err) {
        console.error(err);
    }
}

export const updateSubTaskDone = async (subtask: Object) => {
    localTasks.updateSubtaskFromList(subtask);

    try { 
        await submitCUDInfo(`/task/update-subtask`, subtask, 'createUpdate');
    }  catch(err) {
        console.error(err);
    }
}

export const getPricesTotal = (taskId: String) => {
    const currentTasks = localTasks.getTasks();
    const selectedTask = currentTasks.find((task: { _id: string }) => task._id === taskId);

    let totalPrice = 0;

    selectedTask.subtask.forEach((subtask: { price: string }) => {
        if(subtask.price !== null) {
            totalPrice = totalPrice + +subtask.price;
        }
    })

    return totalPrice;
}

export const getTask = async (taskId: String) => {
    console.log('Fetch Get Task');
    console.log(taskId);

    try {
        const response = await fetch(`/edit-task/${taskId}`);
        const data = await response.json();

        if(response.status === 500 || response.status === 404 || response.status === 400) {
            throw Error(data);
        }
        console.log(response);
        console.log(data);

        return data;
    } catch(err) {
        console.error(err);
    }
}


export const editTask = async (task: Object,  cb: Function) => {
    try {
        const response = await fetch('/edit-task/', {
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