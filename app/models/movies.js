import mongoose, { Schema } from 'mongoose';

const Scheme = mongoose.Schema;

const MovieSchema = new Schema({
    name: String,
    year: String,
    director: String,
    genre: String,
    runtime: Number
}, {
    timestamps: true,
    collection: 'movies'
});

export default mongoose.model('Movie', MovieSchema);