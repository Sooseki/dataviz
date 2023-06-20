import mongoose from "mongoose";

const models = new mongoose.Schema({
	client: {
		type: String,
		required: true,
		unique: true,
	},
    
})