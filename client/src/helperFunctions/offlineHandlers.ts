import swal from 'sweetalert';
import { submitCUDInfo } from './requestsHandlers';

const localHost = process.env.NODE_ENV === 'development' ? 'http://localhost:4001' : '';

export const allQueues = {
    newTasksQueue: 'newTasksQueue',
    eraseTasksQueue: 'eraseTasksQueue',
    updateTasksQueue: 'updateTasksQueue',
    updateEditedTasksQueue: 'updateEditedTasksQueue',
    newSubtasksQueue: 'newSubtasksQueue',
    eraseSubtasksQueue: 'eraseSubtasksQueue',
    updateSubtasksQueue: 'updateSubtasksQueue'
};

export const offlineService = {
    getQueue(queue: string) {
        return JSON.parse(localStorage.getItem(queue) || '[]');
    },

    updateQueue(queue: string, payload: any) {
        const currentQueue = this.getQueue(queue);

        if(queue === 'eraseTasksQueue') {
            // For tasks that are in queue but not yet in database
            if(payload.id === undefined) {
                swal('Could not delete', 'Try again when you are back online', 'error');
                throw Error('You need to be online to be able to take that action');
            } else {
                currentQueue.push(payload);
                localStorage.setItem(queue, JSON.stringify(currentQueue));
            }
        } else if(queue === 'updateTasksQueue' || queue === 'updateEditedTasksQueue') {
            const updatedQueue = currentQueue.filter((task: { 
                done: boolean,
                id: String
            }) => task.id !== payload.id)

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

const clearQueues = () => {
    for(let queue in allQueues) {

        const pending = offlineService.getQueue(`${queue}`);

        if(pending.length > 0) {
            switch(`${queue}`){
                case 'newTasksQueue':
                    pending.forEach(async (task: Object) => await submitCUDInfo(`${localHost}/task/new-todo`, task, 'createUpdate'));
                    offlineService.clearQueue(`${queue}`);
                    break;
                case 'newSubtasksQueue':
                    pending.forEach(async (subtask: Object) => await submitCUDInfo(`${localHost}/task/new-subtask`, subtask, 'createUpdate'));
                    offlineService.clearQueue(`${queue}`);
                    break;
                case 'updateTasksQueue':
                    pending.forEach(async (task: Object) => await submitCUDInfo(`${localHost}/task/update-task`, task, 'createUpdate'));
                    offlineService.clearQueue(`${queue}`);
                    break;
                case 'updateEditedTasksQueue':
                    pending.forEach(async (task: Object) => await submitCUDInfo(`${localHost}/task/get-task/edit`, task, 'createUpdate'));
                    offlineService.clearQueue(`${queue}`);
                    break;
                case 'updateSubtasksQueue':
                    pending.forEach(async (subtask: Object) => await submitCUDInfo(`${localHost}/task/update-subtask`, subtask, 'createUpdate'));
                    offlineService.clearQueue(`${queue}`);
                    break;
                case 'eraseTasksQueue':
                    pending.forEach(async (task: { id: string }) => await submitCUDInfo(`${localHost}/task/erase-task`, task, 'erasure'));
                    offlineService.clearQueue(`${queue}`);
                    break;
                default:
                    pending.forEach(async (id: string) => await submitCUDInfo(`${localHost}/task/remove-subtask`, { id }, 'erasure'));
                    offlineService.clearQueue(`${queue}`);
            };
        };
    };
};