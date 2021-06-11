import { Server } from "socket.io";
import { ticketModel, userModel } from "./../database/models.js";
import env from "./../config.js";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

export let allSockets = [];

const __dirname = path.dirname((global.__dirname = process.cwd()));

export function initIO(httpServer) {
	const io = new Server(httpServer, {
		origins: [env.FRONTEND],
		cors: {
			origin: env.FRONTEND,
			methods: ["GET", "POST"],
			credentials: false,
		},
		allowEIO3: true,
		maxHttpBufferSize: 1e7,
	});

	io.on("connection", async (socket) => {
		if (socket.request._query.userId) {
			allSockets.push(socket);
			let user = await userModel.findById(socket.request._query.userId);
			if (user) {
				user.online = true;
				await user.save();
				socket.broadcast.emit("userChangeState", {
					userId: user._id,
					online: true,
				});
			}
		}

		socket.on("join-room", (id) => {
			socket.join(id);
		});

		socket.on("send-message", async (data) => {
			const _id = mongoose.Types.ObjectId();

			const response = async (err, file) => {
				if (err) throw err;

				await ticketModel.findByIdAndUpdate(data.ticket_id, {
					$push: {
					messages: {
							_id,
							text: data.text,
							date: data.date,
							author: data.author,
							file: file,
						},
					},
				});

				let user = await userModel.findById(data.author, "username img");

				io.to(data.ticket_id).emit("send-message", {
					_id,
					text: data.text,
					date: data.date,
					author: { _id: data.author, username: user.username, img: user.img },
					file: file,
				});
			};

			if (data.file) {
				await fs.writeFile(
					`${__dirname}/backend/public/documents/_${_id}.${data.file.ext}`,
					data.file.file,
					(err) =>
						response(err, {
							_id,
							name: data.file.name,
							ext: data.file.ext,
						})
				);
			} else response();
		});

		socket.on("typing", (typing, user) => {
			socket.broadcast.emit("typing", { typing, user });
		});

		socket.on("logout", (id) => {
			socket.broadcast.emit("userChangeState", {
				userId: id,
				online: false,
			});
		});

		socket.on("disconnect", async () => {
			var i = allSockets.indexOf(socket);
			if (allSockets[i]) {
				let user = await userModel.findById(
					allSockets[i].request._query.userId
				);
				user.online = false;
				socket.broadcast.emit("typing", {
					typing: false,
					user: { _id: user._id },
				});
				socket.broadcast.emit("userChangeState", {
					userId: user._id,
					online: false,
				});
				await user.save();
				allSockets.splice(i, 1);
			}
		});
	});
	return io;
}
