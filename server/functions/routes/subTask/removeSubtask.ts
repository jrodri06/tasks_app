import { Router, Request, Response } from 'express';

import SubTask from '../../models/SubTask';

const route = Router();

route.post('/', async (req: Request, res: Response) => {
    if(req.headers['x-http-method-override']  === 'DELETE')  {
        const { id } = req.body;

        try {
            const sub = await SubTask.findOne({ _id: id });
            await SubTask.findOneAndDelete({ _id: id });
            res.status(200).json(sub);
        } catch(err) {
            res.status(500).json({ message: `Your request was not processed: ${err.message}` });
        }
    } else {
        res.status(400).json({ message: 'Request missing override method' });
    }
});

export default route;