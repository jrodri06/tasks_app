import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import mongoose from 'mongoose';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser'; 

import routes from './routes';

config();
const app = express();

app.use(cors({
    "origin": '*',
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}));

app.use(bodyParser.json());
app.use(methodOverride('_method'));

app.use(cookieParser());

// set a cookie
app.use((req: Request, res: Response, next: NextFunction) => {
    const cookie = req.cookies.tasksListUbi;
    if (cookie === undefined) {
        let randomNumber = Math.random().toString();
        randomNumber = randomNumber.substring(2, randomNumber.length);

        //10 * 365 * 24 * 60 * 60 * 1000 === 315360000000, or 10 years in milliseconds
        const expiryDate = new Date(Number(new Date()) + 315360000000);

        res.cookie('tasksListUbi', randomNumber, { expires: expiryDate, httpOnly: false });
    } else {
        console.log('cookie exists', cookie);
    } 
    next();
});

mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.DB_CONNECT!, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
    .then(() => console.log('Connected to db!'))
    .catch(err => console.log(`Error occurred! ${err.message}`));
app.use(routes);

const buildPath = path.join(__dirname, '../client', 'build');
app.use(express.static(buildPath));

app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname + '/../client/build/index.html'));
});

app.listen(process.env.PORT || 4001, () => console.log(`Server is running on port 4001`));