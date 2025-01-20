import express from 'express';
import mongoose from "mongoose";
import {faker} from '@faker-js/faker';
import dotenv from 'dotenv';
import pokemons from "./routes/pokemons.js";

dotenv.config();
const app = express()
mongoose.connect('mongodb://127.0.0.1:27017/PRG6-Eindopdracht');
const port = 8001


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Toegestaan voor alle origins, maar je kunt hier een specifieke origin opgeven
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, Content-Type, Accept, Authorization'
    ); // Specificeer toegestane headers
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS'
    ); // Specificeer toegestane HTTP-methoden

    // Indien het een preflight OPTIONS-verzoek is, direct een 204-respons teruggeven
    if (req.method === 'OPTIONS') {
        res.status(204).end();
    } else {
        next();
    }
});



app.use((req, res, next)=> {
    const acceptHeader = req.headers.accept;
    console.log('headers', req.headers)

    if (acceptHeader !== 'application/json') {
        console.log("JSON NOT INCLUDED", acceptHeader)
        return res.status(406).json({ error: "Only JSON is accepted" });
    }    else {
        console.log("JSON INCLUDED", acceptHeader)

    }
    next()
})

// app.use(express.json());
// app.use(express.urlencoded({extended: true}));


app.use('/pokemons', pokemons)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})