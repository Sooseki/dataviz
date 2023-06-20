import { Schema, SchemaTypes, model } from "mongoose";

const clientSchema = new Schema({
    name: String,
    users: [{
        type: SchemaTypes.ObjectId,
        ref: "User",
        required: true,
    }]
})

const Client = model("Client", clientSchema);
export default Client;