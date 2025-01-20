import express from 'express';
import mongoose from "mongoose";
import {faker} from '@faker-js/faker';
import dotenv from 'dotenv';

const app = express()
const port = 8000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})