import { Schema, model } from "mongoose";

const domainSchema = new Schema({
    url: { type: String, required: true },
    datasets: [
        {
            type: Schema.Types.ObjectId,
            ref: "Dataset",
        },
    ],
});

const Domain = model("Domain", domainSchema);
export default Domain;
