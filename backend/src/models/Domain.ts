import { Schema, model } from "mongoose";

const domainSchema = new Schema({
    url: String,
});

const Domain = model("Domain", domainSchema);
export default Domain;