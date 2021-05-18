import express from "express";
import { ticketModel, userModel } from "../database/models.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { isLogged } from "../utils/index.js";
import { allSockets } from "../websocket/index.js";
import { connection } from "../database/models.js";

const router = express.Router();

router.get("/issues", async (req, res) => {
	if (!isLogged(req.headers.authorization)) {
		res.status(403);
		res.end();
		return;
	}
	let usuario = jwt.decode(req.headers.authorization);
	let t = await ticketModel
		.find({ user: { $in: [usuario.id] } }, "title state date")
		.populate({ path: "user", select: "username online img" });
	res.send(t);
});

router.get("/issue", async (req, res) => {
	if (!isLogged(req.headers.authorization)) {
		res.status(403);
		res.end();
		return;
	}

	let t = await ticketModel
		.findById(req.query.id, "author date state title user")
		.populate("user");

	res.send(t);
});

router.post("/issue", async (req, res) => {
	if (!isLogged(req.headers.authorization)) {
		res.status(403);
		res.end();
		return;
	}
	let usuario = jwt.decode(req.headers.authorization);
	await ticketModel.create({
		_id: mongoose.Types.ObjectId(),
		title: req.body.title,
		author: usuario.id,
		messages: [],
		user: [usuario.id],
		date: new Date().getTime(),
		state: "abierto",
	});
	res.end();
});

router.get("/messages", async (req, res) => {
	if (!isLogged(req.headers.authorization)) {
		res.status(403);
		res.end();
		return;
	}
	const page = req.query.page;
	const perPage = 25;

	let m = await ticketModel.findById(req.query.id).populate({
		path: "messages",
		populate: {
			path: "author",
			model: userModel,
			select: "username img",
		},
	});

	let messages = m.messages.slice((page - 1) * perPage, page * perPage);

	try {
		var done =
			messages[messages.length - 1]._id ==
			m.messages[m.messages.length - 1]._id;
	} catch (error) {
		var done = true;
	}
	res.send({ messages: messages.reverse(), done });
});

router.delete("/delete_message", async (req, res) => {
	if (!isLogged(req.headers.authorization)) {
		res.sendStatus(403);
		res.end();
		return;
	}
	let usuario = jwt.decode(req.headers.authorization);
	let msg = await ticketModel.findOne({
		messages: {
			$elemMatch: { _id: req.body.messageId },
		},
	});
	msg.messages = msg.messages.filter((m) => m._id != req.body.messageId);
	await msg.save();

	res.sendStatus(200);
	res.end();
});

router.get("/users", async (req, res) => {
	if (!isLogged(req.headers.authorization)) {
		res.sendStatus(403);
		res.end();
		return;
	}
	let ticket = await ticketModel.findById(req.query.ticketId).lean();
	let users = await userModel
		.find({
			_id: {
				$nin: ticket.user.map(String),
			},
		})
		.lean();
	users = users.filter(
		(u) => u._id != jwt.decode(req.headers.authorization).id
	);

	res.json(users);
	res.end();
});

router.post("/join", async (req, res) => {
	if (!isLogged(req.headers.authorization)) {
		res.status(403);
		res.end();
		return;
	}
	let ticket = await ticketModel.findById(req.body.ticketId);
	if (ticket.state != "cerrado") {
		req.body.users.forEach((userId) => {
			if (!ticket.user.includes(userId))
				ticket.user.push({
					_id: userId,
				});
		});
		await ticket.save();
	}

	res.status(200);
	res.end();
});

router.post("/change_state", async (req, res) => {
	if (!isLogged(req.headers.authorization)) {
		res.status(403);
		res.end();
		return;
	}

	let ticket = await ticketModel.findById(req.body.ticketId);
	let usuario = jwt.decode(req.headers.authorization);

	if (
		ticket.author == usuario.id &&
		["cerrado", "abierto"].includes(req.body.state)
	) {
		ticket.state = req.body.state;
		await ticket.save();
	}

	res.status(200);
	res.end();
});

export default router;
