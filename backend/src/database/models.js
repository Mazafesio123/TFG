import connectDb from "./db.js";
import mongoose from "mongoose";
import { ticketSchema, userSchema, imageSchema } from "./schema.js";
import env from "../config.js";

// mongoose.connect("mongodb://mongo:27017/tfg", {
// 	useNewUrlParser: true,
// 	useUnifiedTopology: true,
// });
const conn = (() => {
	return new Promise(async (resolve) => {
		try {
			await mongoose.connect(env.MONGO, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
				useFindAndModify: false
			});
			resolve(mongoose.connection);
		} catch (err) {
			console.log("error: " + err);
		}
	});
})();

// const mongo = connectDb().then( res => console.log(res) )
export const connection = await conn;
export const ticketModel = mongoose.model("ticket", ticketSchema);
export const userModel = mongoose.model("user", userSchema);
export const imageModel = mongoose.model("image", imageSchema);
