import mongoose from "mongoose";
const { Schema } = mongoose;

export const ticketSchema = new Schema({
	_id: mongoose.Schema.Types.ObjectId,
	title: String,
	author: mongoose.Schema.Types.ObjectId,
	messages: [{ text: String, date: Number, author: {type: mongoose.Schema.Types.ObjectId, ref: 'author'}, file: Object }],
	user: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
	date: { type: Number, default: new Date().getTime() },
	state: String,
});

export const userSchema = new Schema({
	_id: mongoose.Schema.Types.ObjectId,
	username: String,
	email: String,
	password: String,
	defaultPassword: Boolean,
	unido_en: Number,
	img: String,
	online: Boolean,
	admin: Boolean,
});

export const imageSchema = new Schema({
	type: String,
	data: Buffer
});
