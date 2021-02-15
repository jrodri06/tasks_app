import { Router, Request, Response } from 'express';

import SubTask from '../../models/SubTask';

const route = Router();

route.get('/', async (req: Request, res: Response) => {
    const { task } = req.query;
    const response = await SubTask.find({ parentId: task });

    if(response.length === 0) {
        res.status(200).json({ result: [] });
    } else {
        res.status(200).json({ result: response });
    }
});

export default route;