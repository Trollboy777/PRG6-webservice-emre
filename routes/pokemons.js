import express, {request, response, Router} from "express";
import {faker} from "@faker-js/faker";
import Pokemon from "../Models/Pokemon.js";

const router = express.Router();
const baseUrl = process.env.BASE_URL;
router.get('/', async (req, res) => {
    try {
        const mons = await Pokemon.find({});
        res.status(200).json({
            "items": mons,
            "_links": {
                "self": {
                    "href": `${baseUrl}/pokemons/`
                },
                "collection": {
                    "href": `${baseUrl}/pokemons/`
                }
            }
        })

    } catch(error)  {
        res.status(500).json({error:error.message});

    }
})

router.get('/:id', async (req, res) => {
    try {
        const pokeId = req.params.id;
        const pokemon = await Pokemon.findById(pokeId);

        if (pokemon) {
            res.status(200).json(pokemon);
        }
        else {
            res.status(404).json({ error: "Pokemon not found" });
        }

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});



router.post('/seed', async (req, res)=> {try {
        const amount = req.body.amount;
        await Pokemon.deleteMany({});
        for (let i = 0; i< amount; i++) {
            Pokemon.create({
                name: faker.lorem.lines(1),
                typing: faker.lorem.lines(1),
                region: faker.lorem.lines(1),
                imageUrl: faker.lorem.lines(1)
            })
        }
        res.status(201).json({ success: true, message: `${amount} Pokemon items seeded.` });

    } catch (error) {
        res.status(500).json({ error: error.message });

    }
    }
);
router.post('/', async (req, res) => {
    try {

        const { name, typing, region, imageUrl } = req.body;
        const newMon = await Pokemon.create({ name, typing, region, imageUrl });

        res.status(201).json({ success: true, data: newMon });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.delete('/:id', async (req, res) => {

    try {

        const pokeId = req.params.id;
        const result = await Pokemon.findByIdAndDelete(pokeId);

        if (result) {
            res.status(200).json({ success: true, message: "Pokemon deleted successfully." });
        }
        else {
            res.status(404).json({ error: "Pokemon not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
})
router.put('/:id', async (req, res) => {
    try {
        const { name, typing, region, imageUrl } = req.body;
        const pokeId = req.params.id;
        const result = await Pokemon.findByIdAndUpdate(pokeId,
            {name, typing, region, imageUrl},
            {new:true});

        if (result) {
            res.status(201).json({ success: true, data: result });
        }
        else {
            res.status(404).json({ error: "Pokemon not found" });
        }
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.options('/:id', (req, res) =>{
    res.setHeader('Allow', 'GET, PUT,DELETE')
    res.setHeader('Access-Control-Allow-Method', ['GET, PUT, DELETE'])
    res.send();
})
router.options('/', (req, res) =>{
    res.setHeader('GET', 'POST')
    res.setHeader('Access-Control-Allow-Method', ['GET', 'POST'])
    res.send();
})

export default router;