import { Router,  Request, Response } from 'express';

import ToDo from '../../../models/ToDo';

const route = Router();

route.post('/', async (req: Request, res: Response) => {
    const { id, done } = req.body;
    const cookie = req.cookies.tasksListUbi;

    try {
        await ToDo.findOneAndUpdate({ _id: id }, { done, lastUpdatedBy: cookie });
    
        res.status(200).json({ message: 'Done status modified' });
    } catch(err) {
        res.status(500).json({ message: `Your request was not processed: ${err.message}` });
    }
})

export default route;