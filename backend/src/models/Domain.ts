import { Schema, SchemaTypes, model } from "mongoose";

const domainSchema = new Schema({
    url: String,
    datasets: [{
        type: SchemaTypes.ObjectId,
        ref: "Dataset",
    }]
});

const Domain = model("Domain", domainSchema);
export default Domain;