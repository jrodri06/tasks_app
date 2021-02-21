import { Router, Request, Response } from 'express';

import ToDo from '../../../models/ToDo';
import SubTask from '../../../models/SubTask';

const route = Router();

route.get('/:taskId/:userOrigin', async (req: Request, res: Response) => {
    const { taskId, userOrigin } = req.params;

    try {
        const task = await ToDo.findOne({ _id: taskId, userCookie: userOrigin });

        if(task === null) {
            throw Error('Could not find task from link provided');
        } else {
            const subTasks = await SubTask.find({ parentId: task!._id });
            const taskWithSubs = { ...task?.toObject(), subtask: subTasks };
    
            res.status(200).send(taskWithSubs);
        }
    } catch ({ message }) {
        res.status(400).json(message);
    }
});

route.post('/edit', async (req: Request, res: Response) => {
    let updatedTask:  {
        userCookie: String,
        lastUpdatedBy: String,
        name: String,
        description: String,
        type: String,
        specialInput: {
            fooCarbs?: Number,
            foodFat?: Number,
            foodProtein?: Number,
            workDeadline?: string
        },
        price: Number | null,
        done: boolean,
        _id: string
    } = req.body;

    const { _id } = req.body;
    const cookie = req.cookies.tasksListUbi;
    
    updatedTask.lastUpdatedBy = cookie;

    try {

        await ToDo.findByIdAndUpdate(_id, updatedTask);
        res.status(204).json({ message: 'Task has been updated' });
    } catch(err) {
        res.status(500).json({ message: `Your request was not processed: ${err.message}` });
    }
});

export default route;