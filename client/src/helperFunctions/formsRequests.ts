import swal from 'sweetalert';

/*
const offlineService = {  
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
    }
};
*/

/*
const saveData = {
    getTasksStorage() {
        return JSON.parse(localStorage.getItem('tasks') || '[]');
    },

    updateData(data: Object) {
        localStorage.setItem('tasks', JSON.stringify(data));
    },

    clearTasksStorage() {
        localStorage.removeItem('tasks');
    }
}
*/

/*
const handleRequests = async (details: Object, url: string, requestObj: Object) => {
    if (!navigator.onLine) {
        offlineService.deferRequest(details);
        return offlineService.getQueue();
    } else {
        return await fetch(url, requestObj);
    }
}
*/

const submitCreateUpdateInfo = async (url: string, data: object) => {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    /*
    const request = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    const response = await handleRequests(data, url, request);
    console.log('submitCreateUpdateInfo');
    console.log(response);
    */

    if(response?.status === 400 || response?.status === 404 || response?.status === 500) {
        const message = await response.json();
        throw Error(message);
    }

    return response;
};

const submitEraseInfo = async (url: string, data: object) => {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'X-HTTP-Method-Override': 'DELETE'
        },
        body: JSON.stringify(data)
    });

    return response;
};

export const formPath = (userData: object) => {
    submitCreateUpdateInfo(`http://localhost:4001/task/new-todo`, userData)
        .then((data) => {
            if(data) {
                console.log('The DATA');
                console.log(data);
                return data.json()
            }
        })
        .then(res => {
            if(res.message) {
                swal('Horray!', res.message, 'success');
            }
        }) 
        .catch(err => swal('Could not submit!', `An issue ocurred: ${err}`, 'error'));
};

export const collectToDos = async () => {
    const response = await fetch('http://localhost:4001/task/all-tasks');
    const data = await response.json();
    return data;
};

export const eraseTask = async (id: string) => {
    await submitEraseInfo(`http://localhost:4001/task/erase-task`, { id })
        .then(res => console.log(res))
        .catch(err => console.error(err))
}

export const updateDoneStatus = async (dataUpdated: object) => {
    console.log(dataUpdated);
    await submitEraseInfo(`http://localhost:4001/task/update-task`, dataUpdated)
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