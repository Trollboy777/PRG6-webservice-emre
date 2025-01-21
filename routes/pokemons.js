import express, {request, response, Router} from "express";
import {faker} from "@faker-js/faker";
import Pokemon from "../Models/Pokemon.js";
import {parse} from "dotenv";

const router = express.Router();
const baseUrl = process.env.BASE_URL;
router.get('/', async (req, res) => {
    try {
        // const mons = await Pokemon.find({});
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const mons = await Pokemon.find().skip(skip).limit(limit);
        console.log(mons.length + "Dit is de lengte")

        const totalItems = await Pokemon.countDocuments();
        const totalPages = Math.ceil(totalItems/limit);

        res.status(200).json({
            "items": mons,
            "_links": {
                "self": {
                    "href": `${process.env.BASE_URL}/pokemons/`
                },
                "collection": {
                    "href": `${process.env.BASE_URL}/pokemons/`
                }
            },
            "pagination": {
                "currentPage": page,
                "currentItems": mons.length,
                "totalPages": totalPages,
                "_links": {
                    "first": {
                        "page": 1,
                        "href": `${process.env.BASE_URL}/pokemons?page=1&limit=${limit}`
                    },
                    "last": {
                        "page": totalPages,
                        "href": `${process.env.BASE_URL}/pokemons?${totalPages}=1&limit=${limit}`
                    },
                    "previous": page > 1 ? {
                        "page": page - 1,
                        "href": `${process.env.BASE_URL}/pokemons?page=${page - 1}&limit=${limit}`
                    } : null,
                    "next": page < totalPages ? {
                        "page": page + 1,
                        "href": `${process.env.BASE_URL}/pokemons?page=${page + 1}&limit=${limit}`
                    } : null
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