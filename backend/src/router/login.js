import express, { response } from "express";
import { userModel, connection } from "../database/models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { allSockets } from "../websocket/index.js";
import { isLogged } from "../utils/index.js";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";

const __dirname = path.dirname((global.__dirname = process.cwd()));
const router = express.Router();

router.post("/login", async (req, res) => {
	try {
		var t = await userModel.findOne({ email: req.body.username });
	} catch (e) {
		console.error("ERROR => ", e);
	}

	if (!t || !(await bcrypt.compare(req.body.password, t.password))) {
		res.status(403);
		res.end();
	} else {
		let date = new Date();
		date.setDate(date.getDate() + 1);
		let token = jwt.sign(
			{
				id: t._id,
				username: t.username,
				img: t.img,
				admin: t.admin,
				iat: date.getTime(),
			},
			process.env.SECRET
		);
		t.online = true;
		await t.save();

		allSockets.forEach((sock) => {
			sock.emit("userChangeState", {
				userId: t._id,
				online: true,
			});
		});

		res.status(200);
		res.json(token);
	}
});

router.post("/register", async (req, res) => {
	if (!isLogged(req.headers.authorization)) {
		res.status(403);
		res.end();
		return;
	}
	let { id } = jwt.decode(req.headers.authorization);
	let isAdmin = await userModel.findById(id, "admin");
	if (!isAdmin) {
		res.status(403);
		res.end();
		return;
	}

	let _id = mongoose.Types.ObjectId();
	const avatar = req.files.img;
	const uploadPath = path.join(
		__dirname + "/backend/public/avatars/_" + _id + ".png"
	);
	await avatar.mv(uploadPath, (err) => {
		if (err) {
			console.error(err);
			res.sendStatus(400).end();
		}
	});

	let newUser = await userModel.create({
		_id,
		username: req.body.username,
		email: req.body.email,
		img: `_${_id}.png`,
		online: false,
		admin: req.body.admin,
		unido_en: new Date().getTime(),
		password: await bcrypt.hash("1234", await bcrypt.genSalt()),
		defaultPassword: true,
	});

	await newUser.save();
	res.sendStatus(200);
});

router.delete("/login", async (req, res) => {
	let u = await userModel.findById(req.body.id);
	if (!u) res.end();
	u.online = false;
	await u.save();

	allSockets.forEach((sock) => {
		sock.emit("userChangeState", {
			userId: u._id,
			online: false,
		});
	});
	res.status(200);
	res.end();
});

router.post("/save_profile", async (req, res) => {
	if (!isLogged(req.headers.authorization)) {
		res.sendStatus(403);
		res.end();
		return;
	}
	let id = String(jwt.decode(req.headers.authorization).id);

	await userModel.findByIdAndUpdate(id, {
		username: req.body.name,
	});

	if (req.files && req.files.img) {
		const avatar = req.files.img;
		const uploadPath = path.join(
			__dirname + "/backend/public/avatars/_" + id + ".png"
		);
		await avatar.mv(uploadPath, (err) => {
			if (err) {
				console.error(err);
				res.sendStatus(400).end();
			}
		});
	}
	res.end();
});

export default router;
