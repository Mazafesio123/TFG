import path from "path";
import crypto from "crypto";
import mongoose from "mongoose";
import multer from "multer";
import GridFsStorage from "multer-gridfs-storage";
import Grid from "gridfs-stream";
import { connection } from "../database/models.js";
import env from "../config.js";

const storage = new GridFsStorage({
	url: env.MONGO,
	file: (req, file) => {
		return new Promise((resolve, reject) => {
			try {
			crypto.randomBytes(16, (err, buf) => {
				if (err) {
					return reject(err);
				}
				//const filename = buf.toString('hex') + path.extname(file.originalname);
				const filename = file.originalname;
				const fileinfo = {
					filename: filename,
					bucketName: "userdocs",
				};
				resolve(fileinfo);
			});
		} catch (e) {
			console.error('ERROR ==> ', e)
			reject(e)
		}
		});
	},
});
export const upload = multer({ storage });
