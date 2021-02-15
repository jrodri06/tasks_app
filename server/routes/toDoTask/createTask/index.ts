import { Router, Request, Response } from 'express';

import ToDo from '../../../models/ToDo';

const route = Router();

route.post('/', async (req: Request, res: Response) => {
    console.log(req.body);

    const { name, description, type, price, specialInput } = req.body;
    const newTodo = new ToDo({
        name, 
        description, 
        type, 
        price, 
        specialInput
    })

    try {
        await newTodo.save();
        res.status(201).json({ message: `Your task "${name}" has been created` });
    } catch(err) {
        res.status(500).send({ message: `Something went wrong: ${err}` })
    }
});

export default route;