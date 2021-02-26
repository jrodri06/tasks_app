import { submitCUDInfo } from './requestsHandlers';

const localHost = process.env.NODE_ENV === 'development' ? 'http://localhost:4001' : '';

export const allQueues = {
    newTasksQueue: 'newTasksQueue',
    newSubtasksQueue: 'newSubtasksQueue',
    updateTasksQueue: 'updateTasksQueue',
    updateEditedTasksQueue: 'updateEditedTasksQueue',
    updateSubtasksQueue: 'updateSubtasksQueue',
    eraseTasksQueue: 'eraseTasksQueue',
    eraseSubtasksQueue: 'eraseSubtasksQueue'
};

export const offlineService = {
    getQueue(queue: string) {
        return JSON.parse(localStorage.getItem(queue) || '[]');
    },

    updateQueue(queue: string, payload: any) {
        const currentQueue = this.getQueue(queue);

        if(queue === 'updateTasksQueue' || queue === 'updateEditedTasksQueue') {
            const updatedQueue = currentQueue.filter((task: { 
                done: boolean,
                tempIdentifier: string
            }) => task.tempIdentifier !== payload.tempIdentifier)

            updatedQueue.push(payload);
            localStorage.setItem(queue, JSON.stringify(updatedQueue));
        } else {
            currentQueue.push(payload);
            localStorage.setItem(queue, JSON.stringify(currentQueue));
        }
    },

    clearQueue(queue: string) {
        localStorage.removeItem(queue);
    },
};

//  When back online
window.addEventListener('online', () => clearQueues());

//  For pending queues left
window.addEventListener('DOMContentLoaded', () => {
    if (navigator.onLine) {
        clearQueues()
    }
});

const clearQueues = async () => {
    for(let queue in allQueues) {

        const pending = offlineService.getQueue(`${queue}`);

        if(pending.length > 0) {
            switch(`${queue}`){
                case 'newTasksQueue':
                    for(let task of pending) {
                        await submitCUDInfo(`${localHost}/task/new-todo`, task, 'createUpdate');
                    }
                    offlineService.clearQueue(`${queue}`);
                    break;
                case 'newSubtasksQueue':
                    for(let subtask of pending) {
                        await submitCUDInfo(`${localHost}/task/new-subtask`, subtask, 'createUpdate');
                    }
                    offlineService.clearQueue(`${queue}`);
                    break;
                case 'updateTasksQueue':
                    for(let task of pending) {
                        await submitCUDInfo(`${localHost}/task/update-task`, task, 'createUpdate');
                    }
                    offlineService.clearQueue(`${queue}`);
                    break;
                case 'updateEditedTasksQueue':
                    for(let task of pending) {
                        await submitCUDInfo(`${localHost}/task/get-task/edit`, task, 'createUpdate')
                    }
                    offlineService.clearQueue(`${queue}`);
                    break;
                case 'updateSubtasksQueue':
                    for(let subtask of pending) {
                        await submitCUDInfo(`${localHost}/task/update-subtask`, subtask, 'createUpdate');
                    }
                    offlineService.clearQueue(`${queue}`);
                    break;
                case 'eraseTasksQueue':
                    for(let task of pending) {
                        await submitCUDInfo(`${localHost}/task/erase-task`, task, 'erasure');
                    }
                    offlineService.clearQueue(`${queue}`);
                    break;
                default:
                    for(let subtaskTempId of pending) {
                        await submitCUDInfo(`${localHost}/task/remove-subtask`, { subtaskTempId }, 'erasure');
                    }
                    offlineService.clearQueue(`${queue}`);
            };
        };
    };
};