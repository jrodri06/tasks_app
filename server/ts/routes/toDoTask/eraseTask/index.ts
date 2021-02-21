import { Router, Request, Response } from 'express';

import ToDo from '../../../models/ToDo';
import Subtask from '../../../models/SubTask';

const route = Router();

route.post('/', async (req: Request, res: Response) => {
    const userCookie = req.cookies.tasksListUbi;

    if(req.headers['x-http-method-override']  === 'DELETE') {

        try {
            const { id } = req.body;

            const originalUser = process.env.NODE_ENV === 'development' ? 
                await ToDo.findOne({  _id: id }) :
                await ToDo.findOne({  _id: id, userCookie });

            if(originalUser === null) {
                throw Error('You are not the original creator of this task so you cannot delete it');
            } else {
                await ToDo.deleteOne({ _id: id });
                await Subtask.deleteMany({ parentId: id });

                res.status(202).json({ message: `Successfully deleted` });
            }
        } catch(err) {
            console.error(err);
            res.status(500).json({ errorMessage: err.message });
        }

    } else {
        res.status(400).json({ message: 'Could not find "DELETE" in method override' })
    }
});

export default route;