import { localTasks } from './localStorageHandlers';
import { submitCreateUpdateInfo, submitEraseInfo } from './requestsHandlers';

export const offlineService = {  
    getQueue() {
        return JSON.parse(localStorage.getItem('queue') || '[]');
    },

    deferRequest(payload: Object) {
        const queue = this.getQueue();
        queue.push(payload);
        localStorage.setItem('queue', JSON.stringify(queue));
    },

    clearQueue() {
        localStorage.removeItem('queue');
    },

    getErasureQueue() {
        return JSON.parse(localStorage.getItem('erasureQueue') || '[]');
    },

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

    clearErasureQueue() {
        localStorage.removeItem('erasureQueue');
    }
};

//  When back online
window.addEventListener('online', () => {
    const pending = offlineService.getQueue();
    const toErase = offlineService.getErasureQueue();

    if(pending.length > 0) {
        pending.forEach(async (task: Object) => await submitCreateUpdateInfo('http://localhost:4001/task/new-todo', task));
        offlineService.clearQueue();
    }

    if(toErase.length > 0) {
        toErase.forEach(async (task: { id: string }) => await submitEraseInfo('http://localhost:4001/task/erase-task', task));
        offlineService.clearErasureQueue();
    }
});
