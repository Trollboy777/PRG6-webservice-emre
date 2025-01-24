import mongoose from 'mongoose';

const PokemonSchema = new mongoose.Schema({
    name: {type: String, required: true},
    typing: {type: String, required: true},
    region: {type: String, required: true},
    imageUrl: {type: String, required: false},

} , {
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: (doc, ret) => {
            const baseUrl = process.env.BASE_URL;
            ret._links = {
                self: {
                    href: `${baseUrl}/pokemons/${ret._id}`
                },
                collection: {
                    href: `${baseUrl}/pokemons/`
                }
            }

            delete ret._id

        }
    }
});

export default mongoose.model('Pokemon', PokemonSchema);

