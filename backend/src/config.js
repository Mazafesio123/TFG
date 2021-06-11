import dotenv from "dotenv";
import path from 'path';

const __dirname = path.resolve(path.dirname('')); 
dotenv.config({path: __dirname + '\\src\\.env'});

export default {
	PORT: process.env.APP_PORT,
	MONGO: process.env.MONGO_URL,
	SECRET: process.env.SECRET,
	FRONTEND: process.env.APP_FRONTEND,
	BASE_PASSWORD: process.env.BASE_PASSWORD,
};
