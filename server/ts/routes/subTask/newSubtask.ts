import { Router, Request, Response } from 'express';

import SubTask from '../../models/SubTask';

const route = Router();

route.post('/', async (req: Request, res: Response) => {
    const { parentTempId, name, price, done, subtaskTempId } = req.body;
    const newSubTask = new SubTask({ 
        parentTempId, 
        name,
        price,
        subtaskTempId,
        done 
    });

    try {
        await newSubTask.save();
        res.status(201).json({ message: `Your subtask "${name}" has been added` });
    } catch(err) {
        res.status(500).send({ message: `Something went wrong: ${err}` })
    }
});

export default route;