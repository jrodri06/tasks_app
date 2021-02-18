export const localTasks = {
    getTasks() {
        return JSON.parse(localStorage.getItem('tasks') || '[]');
    },

    makeFullList(payload: Object[]) {
        localStorage.setItem('tasks', JSON.stringify(payload));
    },

    removeTaskFromList(element: { id: string }) {
        const current = this.getTasks();
        const newList = current.filter((task: { _id: string }) => task._id !== element.id);

        this.makeFullList(newList);
    },

    updateTaskFromList(element: { 
        id: string, 
        done: boolean 
    }) {
        const current = this.getTasks();
        let taskToUpdate = current.find((task: { _id: string }) => task._id === element.id);

        taskToUpdate = { ...taskToUpdate, done: element.done };

        const newList = current.map((task: { _id: string }) => {
            if(task._id === taskToUpdate._id) {
                return taskToUpdate;
            } else {
                return task;
            }
        });

        this.makeFullList(newList);
    },

    createSubtaskToList(subtask: { 
        done: boolean
        name: String
        parentId: String
        price: String
    }) {
        const current = this.getTasks();
        const parentTask = current.find((task: { _id: string }) => task._id === subtask.parentId);
        parentTask.subtask.push(subtask);

        const newList = current.map((task: { _id: string }) => {
            if(task._id === parentTask._id) {
                return parentTask;
            } else {
                return task;
            }
        });

        this.makeFullList(newList);
    },

    updateSubtaskFromList(subtask: any) {
        const current = this.getTasks();

        let parentTask: {
            description: string,
            done: boolean,
            name: string,
            price: Number,
            specialInput: Object,
            subtask: Object[],
            type: string
            _id: string
        } = current.find((task: { _id: string }) => task._id === subtask.parentId);

        const updatedSubtasks = parentTask.subtask.map((sub: any) => {
            if(sub._id === subtask.taskId) {
                return { ...sub, done: subtask.done };
            } else {
                return sub;
            }
        });

        parentTask.subtask = updatedSubtasks;

        const newList = current.map((task: { _id: string }) => {
            if(task._id === parentTask._id) {
                return parentTask;
            } else {
                return task;
            }
        });

        this.makeFullList(newList);
    },

    clearList() {
        localStorage.removeItem('tasks');
    }
}
