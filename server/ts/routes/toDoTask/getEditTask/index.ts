import { Router, Request, Response } from 'express';

import Todo from '../../../models/ToDo';
import SubTask from '../../../models/SubTask';

const route = Router();

route.get('/:tempId/:userOrigin', async (req: Request, res: Response) => {
    const { tempId, userOrigin } = req.params;

    try {
        const task = await Todo.findOne({ tempIdentifier: tempId, userCookie: userOrigin });

        if(task === null) {
            throw Error('Could not find task from link provided');
        } else {
            const subTasks = await SubTask.find({ parentTempId: task.tempIdentifier });
            const taskWithSubs = { ...task?.toObject(), subtask: subTasks };
    
            res.status(200).send(taskWithSubs);
        }
    } catch ({ message }) {
        res.status(400).json(message);
    }
});

route.post('/edit', async (req: Request, res: Response) => {
    let updatedTask = req.body;

    const { _id, tempIdentifier } = req.body;
    const cookie = req.cookies.tasksListUbi;
    
    updatedTask.lastUpdatedBy = cookie;

    try {
        if(_id === undefined) {
            await Todo.findOneAndUpdate({ tempIdentifier }, updatedTask);
            res.status(204).json({ message: 'Task has been updated' });
        } else {
            await Todo.findByIdAndUpdate(_id, updatedTask);
            res.status(204).json({ message: 'Task has been updated' });
        }
    } catch(err) {
        res.status(500).json({ message: `Your request was not processed: ${err.message}` });
    }
});

export default route;