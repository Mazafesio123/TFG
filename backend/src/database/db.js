import mongoose from "mongoose";

export default function connectDb() {
	return new Promise(async (resolve, reject) => {
		const mongo = await mongoose.connect("mongodb://localhost:27017/tfg", {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
    console.log("CONNECTED")
		resolve(mongo);
    return mongo;
	});
};