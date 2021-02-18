import { submitCUDInfo } from './requestsHandlers';

export const allQueues = {
    newTasksQueue: 'newTasksQueue',
    eraseTasksQueue: 'eraseTasksQueue',
    updateTasksQueue: 'updateTasksQueue',
    newSubtasksQueue: 'newSubtasksQueue',
    eraseSubtasksQueue: 'eraseSubtasksQueue',
    updateSubtasksQueue: 'updateSubtasksQueue'
};

export const offlineService = {
    getQueue(queue: string) {
        return JSON.parse(localStorage.getItem(queue) || '[]');
    },

    updateQueue(queue: string, payload: Object) {
        const currentQueue = this.getQueue(queue);
        currentQueue.push(payload);

        localStorage.setItem(queue, JSON.stringify(currentQueue));
    },

    clearQueue(queue: string) {
        localStorage.removeItem(queue);
    },
};

/*

    erasureQueue(payload: { id: string }) {
        // Update Local Storage Tasks
        const tasks = localTasks.getTasks();
        const newQueue = tasks.filter((task: { _id: string }) => task._id !== payload.id);
        localStorage.setItem('tasks', JSON.stringify(newQueue));

        // Add payload to erasure queue
        const erasureQueue = this.getErasureQueue();
        erasureQueue.push(payload);
        localStorage.setItem('erasureQueue', JSON.stringify(erasureQueue));
    },

*/



//  When back online
window.addEventListener('online', () => clearQueues());

const clearQueues = () => {
    for(let queue in allQueues) {

        const pending = offlineService.getQueue(`${queue}`);

        if(pending.length > 0) {
            switch(`${queue}`){
                case 'newTasksQueue':
                    pending.forEach(async (task: Object) => await submitCUDInfo('http://localhost:4001/task/new-todo', task, 'createUpdate'));
                    offlineService.clearQueue(`${queue}`);
                    break;
                case 'eraseTasksQueue':
                    pending.forEach(async (task: { id: string }) => await submitCUDInfo('http://localhost:4001/task/erase-task', task, 'erasure'));
                    offlineService.clearQueue(`${queue}`);
                    break;
                case 'updateTasksQueue':
                    pending.forEach(async (task: Object) => await submitCUDInfo('http://localhost:4001/task/update-task', task, 'createUpdate'));
                    offlineService.clearQueue(`${queue}`);
                    break;
                case 'newSubtasksQueue':
                    pending.forEach(async (subtask: Object) => await submitCUDInfo('http://localhost:4001/task/new-subtask', subtask, 'createUpdate'));
                    offlineService.clearQueue(`${queue}`);
                    break;
                case 'updateSubtasksQueue':
                    pending.forEach(async (subtask: Object) => await submitCUDInfo('http://localhost:4001/task/update-subtask', subtask, 'createUpdate'));
                    offlineService.clearQueue(`${queue}`);
                    break;
                default:
                    pending.forEach(async (id: Object) => await submitCUDInfo('http://localhost:4001/task/remove-subtask', id, 'erasure'));
                    offlineService.clearQueue(`${queue}`);
            };
        };
    };
};