import { Router, Request, Response } from 'express';

import ToDo from '../../models/ToDo';
import SubTask from '../../models/SubTask';

const route = Router();

route.get('/', async (req: Request, res: Response) => {
    const userCookie = req.cookies.tasksListUbi;

    try {
        const allData = await ToDo.find({ userCookie });
    
        let subTasks: { position: Number, subTask: object[] }[] = [];
        let position = 0;
    
        for (let task of allData) {
            const results = await SubTask.find({ parentId: task._id });
            if(results.length > 0) {
                subTasks = [  ...subTasks, {
                    position,
                    subTask: results
                }]
            }  else {
                subTasks = [  ...subTasks, {
                    position,
                    subTask: []
                }]
            }
    
            position++;
        };
        
        const final = allData.map((task, i) => {
            const match = subTasks.find(subtask => subtask.position === i);
            
            if(match === undefined){
                return task;
            } else {
                return  {
                    ...task.toObject(),
                    subtask: match.subTask
                }
            }
    
        });

        res.status(200).send(final);
    }
    catch(err) {
        res.status(500).json({ message: `A problem occured: ${err.message}` });
    }
})

export default route;