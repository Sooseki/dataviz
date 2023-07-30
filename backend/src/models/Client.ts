import { Schema, SchemaTypes, model } from "mongoose";

const clientSchema = new Schema({
    id: String,
    name: String,
    users: [{
        type: SchemaTypes.ObjectId,
        ref: "User",
        required: true,
    }],
    domains: [{
        type: SchemaTypes.ObjectId,
        ref: "Domain",
        required: true,
    }]
});

const Client = model("Client", clientSchema);
export default Client;