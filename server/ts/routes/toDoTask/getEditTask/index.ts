import { Router, Request, Response } from 'express';

import ToDo from '../../../models/ToDo';

const route = Router();

route.get('/:taskId', async (req: Request, res: Response) => {
    console.log('Get Task');
    const { taskId } = req.params;

    try {
        const task = await ToDo.findById(taskId);
        res.status(200).send(task);
    } catch (err) {
        res.status(500).send(err);
    }
});

route.post('/', async (req: Request, res: Response) => {
    const { _id } = req.body;
    const updatedTask = req.body;

    try {
        await ToDo.findByIdAndUpdate(_id, updatedTask);
        res.status(204).json({ message: 'Task has been updated' });
    } catch(err) {
        res.status(500).json({ message: `Your request was not processed: ${err.message}` });
    }
});

export default route;