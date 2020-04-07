import express from 'express';
import mongoose from 'mongoose';
import config from './config';

const app = express();

mongoose.connect(config.DB.url, {
    useNewUrlParser: true,
}).then(() => {
    console.log('Successfully connected to the database')
}).catch((err) => {
    console.log('Could not connect to the database. Exiting now...');
    console.log('err ', err);
    process.exit();
});
app.listen(config.port, () => {
    console.log(`Server is up on ${config.port} port`);
});

