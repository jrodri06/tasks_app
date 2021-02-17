import { Router } from 'express';

import allTasks from './allTasks';

import createTask from './toDoTask/createTask';
import eraseTask from './toDoTask/eraseTask';
import updateTask from './toDoTask/updateTask';

import newSubTask from './subTask/newSubtask';
import updateSubTask from './subTask/updateSubtask';
import removeSubTask from './subTask/removeSubtask';
import totalPriceSubtasks from './subTask/totalPriceSubtasks';

const routes = Router();

routes.use('/task/all-tasks', allTasks);

routes.use('/task/new-todo', createTask);
routes.use('/task/erase-task', eraseTask);
routes.use('/task/update-task', updateTask);

routes.use('/task/new-subtask', newSubTask);
routes.use('/task/remove-subtask', removeSubTask);
routes.use('/task/update-subtask', updateSubTask);
routes.use('/task/total-price-subtasks', totalPriceSubtasks);

export default routes;