import { getUserCookie } from './getCookie';

export const localTasks = {
    getTasks() {
        return JSON.parse(localStorage.getItem('tasks') || '[]');
    },

    makeFullList(payload: Object[]) {
        localStorage.setItem('tasks', JSON.stringify(payload));
    },

    createTaskToList(task: any) {
        const current = this.getTasks();
        const cookieVal = getUserCookie();

        task.userCookie = cookieVal;
        task.lastUpdatedBy = cookieVal;
        task.subtask = [];

        current.push(task);

        this.makeFullList(current);
    },

    removeTaskFromList(element: { id: string }) {
        const current = this.getTasks();
        const newList = current.filter((task: { tempIdentifier: string }) => task.tempIdentifier !== element.id);

        this.makeFullList(newList);
    },

    updateTaskFromList(element: { 
        id: string, 
        tempIdentifier: string,
        done: boolean 
    }) {
        const current = this.getTasks();
        let taskToUpdate = current.find((task: { tempIdentifier: string }) => task.tempIdentifier === element.tempIdentifier);

        taskToUpdate = { ...taskToUpdate, done: element.done };

        const newList = current.map((task: { tempIdentifier: string }) => {
            if(task.tempIdentifier === taskToUpdate.tempIdentifier) {
                return taskToUpdate;
            } else {
                return task;
            }
        });

        this.makeFullList(newList);

        const updatedByEdit = JSON.parse(localStorage.getItem('updateEditedTasksQueue') || '[]');
        // Tasks edited
        if(updatedByEdit.length > 0) {
            const editedTaskListUpdated = updatedByEdit.map((task: { tempIdentifier: string }) => {
                if(task.tempIdentifier === element.tempIdentifier) {
                    return { ...task, done: element.done }
                } else {
                    return task;
                }
            });

            localStorage.setItem('updateEditedTasksQueue', JSON.stringify(editedTaskListUpdated));
        }
    },

    updateEditedTaskFromList(element: {
        userCookie: string,
        lastUpdatedBy: string,
        name: string,
        description: string,
        type: string,
        specialInput: {
            fooCarbs?: number,
            foodFat?: number,
            foodProtein?: number,
            workDeadline?: string
        },
        price: number | null,
        tempIdentifier: string,
        done: boolean,
        _id: string
    }) {
        const current = this.getTasks();

        const newList = current.map((task: { tempIdentifier: string }) => {
            if(task.tempIdentifier === element.tempIdentifier) {
                return element;
            } else {
                return task;
            }
        });

        this.makeFullList(newList);
    },

    createSubtaskToList(subtask: { 
        done: boolean
        name: string
        parentTempId: string
        subtaskTempId: string
        price: string
    }) {
        const current = this.getTasks();

        const parentTask = current.find((task: { tempIdentifier: string }) => task.tempIdentifier === subtask.parentTempId);
        parentTask.subtask.push(subtask);

        const newList = newListSub(current, parentTask);
        this.makeFullList(newList);
    },

    updateSubtaskFromList(subtask: any) {
        const current = this.getTasks();

        let parentTask: {
            description: string,
            done: boolean,
            name: string,
            price: number,
            specialInput: object,
            subtask: object[],
            tempIdentifier: string,
            type: string
        } = current.find((task: { tempIdentifier: string }) => task.tempIdentifier === subtask.parentTempId);

        const updatedSubtasks = parentTask.subtask.map((sub: any) => {
            if(sub.subtaskTempId === subtask.subtaskTempId) {
                return { ...sub, done: subtask.done };
            } else {
                return sub;
            }
        });
        parentTask.subtask = updatedSubtasks;

        const newList = newListSub(current, parentTask);
        this.makeFullList(newList);
    },
    
    removeSubtaskFromList(subtask: any) {
        const current = this.getTasks();

        let parentTask: {
            description: string,
            done: boolean,
            name: string,
            price: number,
            specialInput: object,
            subtask: object[],
            type: string
            tempIdentifier: string
        } = current.find((task: { tempIdentifier: string }) => task.tempIdentifier === subtask.parentTempId);

        const updatedSubtasks = parentTask.subtask.filter((sub: any) => sub.subtaskTempId !== subtask.subtaskTempId);
        parentTask.subtask = updatedSubtasks;

        const newList = newListSub(current, parentTask);
        this.makeFullList(newList);
    },

    clearList() {
        localStorage.removeItem('tasks');
    }
}

const newListSub = (
    current: { tempIdentifier: string }[], 
    parentTask: {
        description: string,
        done: boolean,
        name: string,
        price: number,
        specialInput: object,
        subtask: object[],
        tempIdentifier: string,
        type: string
    }
) => current.map((task: { tempIdentifier: string }) => {
    if(task.tempIdentifier === parentTask.tempIdentifier) {
        return parentTask;
    } else {
        return task;
    }
});