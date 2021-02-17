export const localTasks = {
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
