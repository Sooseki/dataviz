import { Schema, model } from "mongoose";

const datasetSchema = new Schema({
    date: Date,
    timeToLoad: Number,
    firstContentfulPaint: String,
    cumulativeLayoutShift: String,
    totalBlockingTime: String,
    timeToInteractive: String,
    jsUseRate: [Schema.Types.Mixed]
});

const Dataset = model("Dataset", datasetSchema);
export default Dataset;