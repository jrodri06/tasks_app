import { Router, Request, Response } from 'express';

import SubTask from '../../models/SubTask';

const route = Router();

route.post('/', async (req: Request, res: Response) => {
    const { subtaskTempId, done } = req.body;

    try {
        await SubTask.findOneAndUpdate({ subtaskTempId }, { done });
        res.status(200).json({ message: 'Done status updated' });
    } catch(err) {
        res.status(500).json({ message: `Your request was not processed: ${err.message}` });
    }
});

export default route;