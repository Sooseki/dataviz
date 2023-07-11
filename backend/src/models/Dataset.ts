import { Schema, model } from "mongoose";

const datasetSchema = new Schema({
    date: Date,
    // here we can add all the data we want to get
    timeToLoad: Number,
});

const Dataset = model("Dataset", datasetSchema);
export default Dataset;