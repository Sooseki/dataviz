import { Schema, model } from "mongoose";

const datasetSchema = new Schema({
    date: Date,
    timeToLoad: Number,
    firstContentfulPaint: Number,
    cumulativeLayoutShift: Number,
    totalBlockingTime: Number,
    timeToInteractive: Number,
    jsUseRate: [Schema.Types.Mixed]
});

const Dataset = model("Dataset", datasetSchema);
export default Dataset;