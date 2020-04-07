import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import logger from 'morgan';
import path from 'path';

import router from './routes';
import config from './config';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use('/images', express.static(path.join('./images')));

mongoose.connect(config.DB.url, {
    useNewUrlParser: true,
}).then(() => {
    console.log('Successfully connected to the database')
}).catch((err) => {
    console.log('Could not connect to the database. Exiting now...');
    console.log('err ', err);
    process.exit();
});

router(app);

app.listen(config.port, () => {
    console.log(`Server is up on ${config.port} port`);
});

