import express from 'express';
import mongoose from "mongoose";
import {faker} from '@faker-js/faker';
import dotenv from 'dotenv';
import pokemons from "./routes/pokemons.js";

dotenv.config();
const app = express()
mongoose.connect('mongodb://127.0.0.1:27017/PRG6-Eindopdracht');
const port = 8001


app.use('/', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization')

    next();
})



app.use((req, res, next)=> {
    const acceptHeader = req.headers.accept;
    console.log('headers', req.headers)

    if (acceptHeader !== 'application/json' && req.method !== 'OPTIONS') {
        console.log("JSON NOT INCLUDED", acceptHeader)
        return res.status(406).json({ error: "Only JSON is accepted" });
    }    else {
        console.log("JSON INCLUDED", acceptHeader)
        next()

    }

})

app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use('/pokemons', pokemons)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})