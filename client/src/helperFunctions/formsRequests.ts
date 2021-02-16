import swal from 'sweetalert';

const offlineService = {  
    getQueue() {
        return JSON.parse(localStorage.getItem('queue') || '[]');
    },

    getErasureQueue() {
        return JSON.parse(localStorage.getItem('erasureQueue') || '[]');
    },

    erasureQueue(payload: { id: string }) {
        const tasks = localTasks.getTasks();

        const newQueue = tasks.filter((task: { _id: string }) => task._id !== payload.id)

        const erasureQueue = this.getErasureQueue();
        erasureQueue.push(payload);

        localStorage.setItem('erasureQueue', JSON.stringify(erasureQueue));
        localStorage.setItem('tasks', JSON.stringify(newQueue));
    },

    deferRequest(payload: Object) {
        const queue = this.getQueue();
        queue.push(payload);

        localStorage.setItem('queue', JSON.stringify(queue));
    },

    clearQueue() {
        localStorage.removeItem('queue');
    },

    clearErasureQueue() {
        localStorage.removeItem('erasureQueue');
    }
};

const localTasks = {
    getTasks() {
        return JSON.parse(localStorage.getItem('tasks') || '[]');
    },

    makeList(payload: Object[]) {
        localStorage.setItem('tasks', JSON.stringify(payload));
    },

    clearList() {
        localStorage.removeItem('tasks');
    }
}

//  When back online
window.addEventListener('online', () => {
    console.log('ONLINE');
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

const handleRequests = async (details: any, url: string, requestObj: Object, requestType: 'erasure' | 'createUpdate') => {
    if (!navigator.onLine && requestType === 'createUpdate') {
        offlineService.deferRequest(details);
        return offlineService.getQueue();
    } 
    else if(!navigator.onLine && requestType === 'erasure') {
        offlineService.erasureQueue(details);
        return offlineService.getQueue();
    } 
    else {
        return await fetch(url, requestObj);
    }
}

const submitCreateUpdateInfo = async (url: string, data: object) => {
    const request = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    const response = await handleRequests(data, url, request, 'createUpdate');

    if(response?.status === 400 || response?.status === 404 || response?.status === 500) {
        const { message } = await response.json();

        throw Error(message);
    }

    return response;
};

export const formPath = (userData: object, cb: Function) => {
    submitCreateUpdateInfo(`http://localhost:4001/task/new-todo`, userData)
        .then(data => {
            if(Object.keys(data).length > 0) {
                // retrieved from local storage due to user being offline
                return { message: `Your task "${data[data.length - 1].name}" will be added to the database once you're back online` };
            } else {
                return data.json();
            }
        })
        .then(res => {
            if(res.message) {
                swal('Horray!', res.message, 'success');
            }

            console.log('Callback');
            cb();
        }) 
        .catch(err => swal('Could not submit!', `${err}`, 'error'));
};

export const collectToDos = async (cb: Function) => {
    
    try {
        const response = await fetch('http://localhost:4001/task/all-tasks');
        const data = await response.json();
        
        localTasks.makeList(data);        
        cb(localTasks.getTasks());
    } catch(err){
        console.error(err.message)
    }
    
};

const submitEraseInfo = async (url: string, data: { id: string }) => {
    const request = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'X-HTTP-Method-Override': 'DELETE'
        },
        body: JSON.stringify(data)
    };

    const response = await handleRequests(data, url, request, 'erasure');
    return response;
};

export const eraseTask = async (id: string) => {
    await submitEraseInfo(`http://localhost:4001/task/erase-task`, { id })
        .then(res => {
            console.log('Task erasure');
            console.log(res);
        })
        .catch(err => console.error(err))
}

export const updateDoneStatus = async (dataUpdated: object) => {
    console.log(dataUpdated);
    await submitCreateUpdateInfo(`http://localhost:4001/task/update-task`, dataUpdated)
        .then(res => res.status)
        .catch(err => console.error(err))
}

export const createSubTask = async (subtask: object) => {
    await submitCreateUpdateInfo(`http://localhost:4001/task/new-subtask`, subtask)
        .then(res => {
            if(typeof res === 'object') {
                return res.status
            } else {
                return {}
            }
        })
        .catch(err => console.error(err))
}

export const updateSubTaskDone = async (subtask: object) => {
    await submitCreateUpdateInfo(`http://localhost:4001/task/update-subtask`, subtask)
        .then(res => {
            if(typeof res === 'object') {
                return res.status
            } else {
                return {}
            }
        })
        .catch(err => console.error(err))
}

export const getPricesTotal = async (taskId: String) => {
    return await fetch(`http://localhost:4001/task/total-price-subtasks/?task=${taskId}`)
        .then(res => res.json())
        .then(data => {
            if(data.result.length === 0) {
                return 0;
            } else {
                let total: Number = 0;
                data.result.map((subtasks: { price: Number } ) => total = +total + +subtasks.price);

                return total;
            }
        })
        .catch(err => console.error(err))
}